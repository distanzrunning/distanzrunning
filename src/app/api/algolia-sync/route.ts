// src/app/api/algolia-sync/route.ts
//
// Sanity → Algolia sync. Webhooks ping POST with a document _id; the
// route fetches the full doc and pushes a transformed record into the
// `distanz_content` index. GET (with secret) does a full reindex.
//
// Indexed types:
//   - post       → editorial articles
//   - productPost → reviews under shoes / gear / nutrition (carries
//                   section so the search modal can route hits to
//                   the correct flat URL: /{section}/{slug})
//   - raceGuide  → race guide pages
import { NextRequest, NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";
import { createClient } from "next-sanity";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
});

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!,
);

const indexName =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "distanz_content";

const INDEXED_TYPES = ["post", "productPost", "raceGuide"] as const;

// Define what gets indexed from each document type
async function transformDocument(doc: any) {
  const baseObject = {
    objectID: doc._id,
    title: doc.title,
    slug: doc.slug?.current,
    _type: doc._type,
    publishedAt: doc.publishedAt || doc._createdAt,
  };

  if (doc._type === "post") {
    return {
      ...baseObject,
      excerpt: doc.excerpt,
      category: doc.category?.title, // Road / Track / Trail
      tags: doc.tags || [],
      author: doc.author?.name,
      mainImage: doc.mainImage?.asset?._ref,
    };
  }

  if (doc._type === "productPost") {
    return {
      ...baseObject,
      excerpt: doc.excerpt,
      productCategory: doc.productCategory?.title,
      // Section is what determines the routing slug — shoes / gear /
      // nutrition. Indexing it keeps the search modal independent of
      // a per-hit Sanity lookup.
      section: doc.productCategory?.section,
      author: doc.author?.name,
      mainImage: doc.mainImage?.asset?._ref,
    };
  }

  if (doc._type === "raceGuide") {
    return {
      ...baseObject,
      location: doc.location,
      eventDate: doc.eventDate,
      distance: doc.distance,
      raceCategory: doc.raceCategory?.title,
    };
  }

  return baseObject;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "No document ID provided" },
        { status: 400 },
      );
    }

    let query = "";

    if (body._type === "post") {
      query = `*[_id == $id][0]{
        _id,
        _type,
        _createdAt,
        title,
        slug,
        excerpt,
        publishedAt,
        category->{title},
        author->{name},
        mainImage,
        tags
      }`;
    } else if (body._type === "productPost") {
      query = `*[_id == $id][0]{
        _id,
        _type,
        _createdAt,
        title,
        slug,
        excerpt,
        publishedAt,
        productCategory->{title, section},
        author->{name},
        mainImage
      }`;
    } else if (body._type === "raceGuide") {
      query = `*[_id == $id][0]{
        _id,
        _type,
        _createdAt,
        title,
        slug,
        publishedAt,
        raceCategory->{title},
        location,
        eventDate,
        distance
      }`;
    } else {
      return NextResponse.json(
        { message: "Unsupported document type" },
        { status: 200 },
      );
    }

    const document = await sanityClient.fetch(query, { id: _id });

    if (!document) {
      // Document was deleted, remove from Algolia
      await algoliaClient.deleteObject({
        indexName,
        objectID: _id,
      });
      return NextResponse.json({ message: "Document removed from index" });
    }

    const algoliaObject = await transformDocument(document);
    await algoliaClient.saveObject({
      indexName,
      body: algoliaObject,
    });

    return NextResponse.json({
      message: "Document indexed successfully",
      objectID: algoliaObject.objectID,
    });
  } catch (error) {
    console.error("Algolia sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync to Algolia", details: (error as Error).message },
      { status: 500 },
    );
  }
}

// Full reindex. Two callers, two auth paths:
//   1. Vercel Cron (scheduled in vercel.json) — Vercel adds an
//      `Authorization: Bearer ${CRON_SECRET}` header automatically.
//   2. Manual (`npm run reindex`, curl) — passes ?secret= matching
//      REINDEX_SECRET in the URL.
// Either path is sufficient; missing both → 401.
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const querySecret = searchParams.get("secret");
    const authHeader = request.headers.get("authorization");

    const cronSecret = process.env.CRON_SECRET;
    const reindexSecret = process.env.REINDEX_SECRET;

    const isVercelCron =
      Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`;
    const isManualTrigger =
      Boolean(reindexSecret) && querySecret === reindexSecret;

    if (!isVercelCron && !isManualTrigger) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = `*[_type in $types && !(_id in path("drafts.**"))]{
      _id,
      _type,
      _createdAt,
      title,
      slug,
      excerpt,
      publishedAt,
      category->{title},
      productCategory->{title, section},
      raceCategory->{title},
      tags,
      author->{name},
      mainImage,
      location,
      eventDate,
      distance
    }`;

    const documents = await sanityClient.fetch(query, {
      types: INDEXED_TYPES,
    });

    const algoliaObjects = await Promise.all(
      documents.map((doc: any) => transformDocument(doc)),
    );

    await algoliaClient.saveObjects({
      indexName,
      objects: algoliaObjects,
    });

    return NextResponse.json({
      message: "Full reindex completed",
      count: algoliaObjects.length,
    });
  } catch (error) {
    console.error("Reindex error:", error);
    return NextResponse.json(
      { error: "Failed to reindex", details: (error as Error).message },
      { status: 500 },
    );
  }
}
