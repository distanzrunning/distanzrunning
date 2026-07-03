"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { ANNOUNCEMENT_CACHE_TAG, isAnnouncementColor } from "@/lib/announcement";

/** Only allow a same-site path or an http(s) URL — blocks javascript:/data:
 *  and other unsafe schemes since the value is rendered as an <a href>. */
function safeHref(raw: string): string | null {
  const h = raw.trim();
  if (!h) return null;
  if (h.startsWith("/")) return h.slice(0, 500);
  try {
    const u = new URL(h);
    if (u.protocol === "http:" || u.protocol === "https:") return h.slice(0, 500);
  } catch {
    // not a valid absolute URL
  }
  return null;
}

/** Save the singleton announcement banner. Auth-gated; bumps updated_at (which
 *  is the public dismissal version) and revalidates the cache tag + public
 *  layout so the change goes live. */
export async function saveAnnouncement(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const enabled = formData.get("enabled") === "true";
  const text = String(formData.get("text") ?? "").slice(0, 300);

  const colorRaw = String(formData.get("color") ?? "canvas");
  const color = isAnnouncementColor(colorRaw) ? colorRaw : "canvas";

  const linkHref = safeHref(String(formData.get("linkHref") ?? ""));

  let serifWordIndices: number[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("serifWordIndices") ?? "[]"));
    if (Array.isArray(parsed)) {
      serifWordIndices = [
        ...new Set(
          parsed.filter((n) => Number.isInteger(n) && n >= 0) as number[],
        ),
      ];
    }
  } catch {
    serifWordIndices = [];
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("announcement_banner")
    .update({
      enabled,
      text,
      serif_word_indices: serifWordIndices,
      color,
      link_href: linkHref,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("[announcement] save failed", error.message);
    throw new Error("Failed to save the announcement");
  }

  revalidateTag(ANNOUNCEMENT_CACHE_TAG);
  revalidatePath("/admin/announcement");
  // Banner is site-wide (rendered in the public layout) — bust every page.
  revalidatePath("/", "layout");
}
