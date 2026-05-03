// src/lib/raceDateRefresh.ts
//
// Scraping + extraction logic for the race date refresh pipeline.
// Lives in lib/ (not in the API route) so both the batch endpoint
// (/api/race-date-refresh) and the per-race admin server action
// (scanRace) can call processRace without duplicating fetch +
// Haiku + Sanity-write logic.

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "next-sanity";

export const FETCH_TIMEOUT_MS = 10_000;
// Haiku context comfortably handles ~30 K chars of stripped page
// text. Truncating bounds token cost on link-heavy / blog-heavy
// race sites without losing the date (which is almost always
// near the top).
export const MAX_PAGE_TEXT_CHARS = 30_000;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface PendingRace {
  _id: string;
  title: string;
  eventDate: string;
  officialWebsite: string;
}

export interface RaceResult {
  _id: string;
  title: string;
  status:
    | "suggested"
    | "no_date_found"
    | "fetch_error"
    | "extract_error"
    | "invalid_date";
  message?: string;
  suggestedNextDate?: string;
  sourceQuote?: string;
  confidence?: "high" | "medium" | "low";
}

interface ExtractionResult {
  next_date: string | null;
  source_quote: string | null;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

// Strip HTML to plain text. Drops <script>/<style> blocks
// entirely (their contents would otherwise leak into the LLM
// prompt as garbage tokens), then collapses tags + whitespace.
// Cheap regex pass; cheerio would be tidier but adds 200 KB.
function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPageText(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Identify ourselves so race websites can contact us
        // rather than silently block — and so we don't pretend
        // to be a browser.
        "User-Agent":
          "DistanzRunningBot/1.0 (+https://distanzrunning.com; date-refresh)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const html = await res.text();
    const text = htmlToText(html);
    return text.slice(0, MAX_PAGE_TEXT_CHARS);
  } finally {
    clearTimeout(timer);
  }
}

async function extractNextDate(
  race: PendingRace,
  pageText: string,
): Promise<ExtractionResult> {
  const today = new Date().toISOString().slice(0, 10);
  const previousDate = race.eventDate.slice(0, 10);

  const prompt = `You are extracting the date of the NEXT scheduled edition of a running race from its official website.

Race name: ${race.title}
Previous edition date (now in the past): ${previousDate}
Today's date: ${today}

Read the website text below and find the date of the NEXT edition. Only return a date if it is explicitly stated on the page AND is after today. If the page only shows past results, says "TBA"/"coming soon" without a concrete date, or is too ambiguous, return null.

Output STRICT JSON only — no markdown, no prose around it:

{
  "next_date": "YYYY-MM-DD" or null,
  "source_quote": "the exact phrase or sentence from the page where you found the date" or null,
  "confidence": "high" | "medium" | "low",
  "reasoning": "one short sentence explaining the choice"
}

WEBSITE TEXT:
${pageText}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response block type");
  }
  const raw = block.text.trim();
  // Tolerate Haiku occasionally wrapping JSON in ```json fences
  // despite the prompt asking it not to.
  const jsonText = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  const parsed = JSON.parse(jsonText) as ExtractionResult;
  return parsed;
}

export async function processRace(
  race: PendingRace,
  options: { dryRun: boolean },
): Promise<RaceResult> {
  let pageText: string;
  try {
    pageText = await fetchPageText(race.officialWebsite);
  } catch (err) {
    return {
      _id: race._id,
      title: race.title,
      status: "fetch_error",
      message: (err as Error).message,
    };
  }

  let extraction: ExtractionResult;
  try {
    extraction = await extractNextDate(race, pageText);
  } catch (err) {
    return {
      _id: race._id,
      title: race.title,
      status: "extract_error",
      message: (err as Error).message,
    };
  }

  if (!extraction.next_date) {
    return {
      _id: race._id,
      title: race.title,
      status: "no_date_found",
      message: extraction.reasoning,
    };
  }

  // Validate the date string parses AND is in the future. Haiku
  // sometimes hallucinates a future date that's actually the
  // previous edition; rejecting <= today keeps junk out.
  const parsed = new Date(extraction.next_date);
  if (Number.isNaN(parsed.getTime()) || parsed <= new Date()) {
    return {
      _id: race._id,
      title: race.title,
      status: "invalid_date",
      message: `Returned date ${extraction.next_date} is invalid or not in the future`,
    };
  }

  if (!options.dryRun) {
    await sanityClient
      .patch(race._id)
      .set({
        // Store as full datetime at noon UTC — eventDate is a
        // datetime, and noon avoids tz-rollover surprises on
        // either side of UTC when the editor approves.
        suggestedNextDate: `${extraction.next_date}T12:00:00Z`,
        suggestedNextDateScrapedAt: new Date().toISOString(),
        suggestedNextDateSourceQuote: extraction.source_quote ?? "",
        suggestedNextDateStatus: "pending",
      })
      .commit();
  }

  return {
    _id: race._id,
    title: race.title,
    status: "suggested",
    suggestedNextDate: extraction.next_date,
    sourceQuote: extraction.source_quote ?? undefined,
    confidence: extraction.confidence,
  };
}

// Process an array with bounded concurrency. Promise.all on the
// full list would hammer all N race sites at once; this keeps it
// to N in-flight, returning results in input order.
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (true) {
        const i = cursor++;
        if (i >= items.length) return;
        results[i] = await fn(items[i]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}
