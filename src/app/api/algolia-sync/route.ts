import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { algoliasearch } from 'algoliasearch';

// Initialize Algolia client
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);

// Get the appropriate index name based on document type
function getIndexNameForType(type: string): string | null {
  switch (type) {
    case 'post':
      return 'posts';
    case 'gearPost':
      return 'gear';
    case 'raceGuide':
      return 'races';
    default:
      return null;
  }
}

// Fetch document from Sanity with all necessary fields
async function fetchDocument(id: string, type: string) {
  let query = '';

  switch (type) {
    case 'post':
      query = `*[_type == "post" && _id == $id][0]{
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        tags,
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "categoryTitle": category->title,
        "categorySlug": category->slug.current,
        body
      }`;
      break;

    case 'gearPost':
      query = `*[_type == "gearPost" && _id == $id][0]{
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        tags,
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "gearCategoryTitle": gearCategory->title,
        "gearCategorySlug": gearCategory->slug.current,
        body
      }`;
      break;

    case 'raceGuide':
      query = `*[_type == "raceGuide" && _id == $id][0]{
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        location,
        eventDate,
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "raceCategoryTitle": raceCategory->title,
        "raceCategorySlug": raceCategory->slug.current,
        body
      }`;
      break;

    default:
      return null;
  }

  return await client.fetch(query, { id });
}

// Transform document for Algolia indexing
function transformForAlgolia(doc: any) {
  if (!doc) return null;

  // Extract plain text from portable text body for searchability
  const bodyText = doc.body
    ?.map((block: any) => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .slice(0, 8000); // Limit body text to 8000 chars for Algolia

  // Base object with common fields
  const baseObject = {
    objectID: doc._id,
    _type: doc._type,
    title: doc.title,
    slug: doc.slug?.current,
    excerpt: doc.excerpt,
    publishedAt: doc.publishedAt,
    mainImageUrl: doc.mainImageUrl,
    authorName: doc.authorName,
    bodyText,
    _updatedAt: new Date().toISOString(),
  };

  // Add type-specific fields for filtering
  if (doc._type === 'post') {
    return {
      ...baseObject,
      tags: doc.tags || [],                    // Array of tags for subfilters
      categoryTitle: doc.categoryTitle,        // Main category (Road, Track, Trail)
      categorySlug: doc.categorySlug,
    };
  }

  if (doc._type === 'gearPost') {
    return {
      ...baseObject,
      tags: doc.tags || [],                    // Array of tags
      gearCategoryTitle: doc.gearCategoryTitle,  // Gear category for subfilters
      gearCategorySlug: doc.gearCategorySlug,
    };
  }

  if (doc._type === 'raceGuide') {
    return {
      ...baseObject,
      location: doc.location,
      eventDate: doc.eventDate,
      raceCategoryTitle: doc.raceCategoryTitle,  // Race category for subfilters
      raceCategorySlug: doc.raceCategorySlug,
    };
  }

  return baseObject;
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature if using Sanity webhooks
    // const signature = request.headers.get('sanity-webhook-signature');
    // TODO: Implement signature verification for production

    const body = await request.json();
    const { _id, _type } = body;

    if (!_id || !_type) {
      return NextResponse.json(
        { error: 'Missing _id or _type in webhook payload' },
        { status: 400 }
      );
    }

    // Get the appropriate Algolia index name
    const indexName = getIndexNameForType(_type);
    if (!indexName) {
      console.log(`Skipping indexing for unsupported type: ${_type}`);
      return NextResponse.json(
        { message: `Type ${_type} not configured for indexing` },
        { status: 200 }
      );
    }

    // Fetch the full document from Sanity
    const document = await fetchDocument(_id, _type);

    if (!document) {
      // Document might have been deleted, remove from Algolia
      console.log(`Document ${_id} not found, removing from Algolia`);
      await algoliaClient.deleteObject({
        indexName,
        objectID: _id
      });
      return NextResponse.json(
        { message: 'Document removed from index' },
        { status: 200 }
      );
    }

    // Transform and index the document
    const algoliaDoc = transformForAlgolia(document);
    if (algoliaDoc) {
      await algoliaClient.saveObject({
        indexName,
        body: algoliaDoc
      });
      console.log(`Successfully indexed ${_type}: ${document.title}`);
      return NextResponse.json(
        { message: 'Document indexed successfully', objectID: _id },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to transform document' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Algolia sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Full reindex endpoint (protected by secret)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const secret = searchParams.get('secret');

    // Health check - no auth needed
    if (!action || action === 'health') {
      return NextResponse.json(
        {
          status: 'ok',
          message: 'Algolia sync webhook endpoint is running',
          supportedTypes: ['post', 'gearPost', 'raceGuide']
        },
        { status: 200 }
      );
    }

    // Reindex requires authentication
    if (action === 'reindex') {
      // Protect this endpoint with a secret
      if (secret !== process.env.ALGOLIA_REINDEX_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      console.log('Starting full reindex...');

      // Fetch all published posts
      const postsQuery = `*[_type == "post" && !(_id in path("drafts.**"))]{
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        tags,
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "categoryTitle": category->title,
        "categorySlug": category->slug.current,
        body
      }`;

      // Fetch all published gear posts
      const gearQuery = `*[_type == "gearPost" && !(_id in path("drafts.**"))]{
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        tags,
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "gearCategoryTitle": gearCategory->title,
        "gearCategorySlug": gearCategory->slug.current,
        body
      }`;

      // Fetch all published race guides
      const racesQuery = `*[_type == "raceGuide" && !(_id in path("drafts.**"))]{
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        location,
        eventDate,
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "raceCategoryTitle": raceCategory->title,
        "raceCategorySlug": raceCategory->slug.current,
        body
      }`;

      // Fetch all documents in parallel
      const [posts, gearPosts, raceGuides] = await Promise.all([
        client.fetch(postsQuery),
        client.fetch(gearQuery),
        client.fetch(racesQuery),
      ]);

      console.log(`Found ${posts.length} posts, ${gearPosts.length} gear posts, ${raceGuides.length} race guides`);

      // Transform and index posts
      const postsToIndex = posts.map(transformForAlgolia).filter(Boolean);
      if (postsToIndex.length > 0) {
        await algoliaClient.saveObjects({
          indexName: 'posts',
          objects: postsToIndex,
        });
        console.log(`Indexed ${postsToIndex.length} posts`);
      }

      // Transform and index gear posts
      const gearToIndex = gearPosts.map(transformForAlgolia).filter(Boolean);
      if (gearToIndex.length > 0) {
        await algoliaClient.saveObjects({
          indexName: 'gear',
          objects: gearToIndex,
        });
        console.log(`Indexed ${gearToIndex.length} gear posts`);
      }

      // Transform and index race guides
      const racesToIndex = raceGuides.map(transformForAlgolia).filter(Boolean);
      if (racesToIndex.length > 0) {
        await algoliaClient.saveObjects({
          indexName: 'races',
          objects: racesToIndex,
        });
        console.log(`Indexed ${racesToIndex.length} race guides`);
      }

      return NextResponse.json(
        {
          message: 'Full reindex completed',
          counts: {
            posts: postsToIndex.length,
            gear: gearToIndex.length,
            races: racesToIndex.length,
            total: postsToIndex.length + gearToIndex.length + racesToIndex.length,
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action. Use ?action=health or ?action=reindex' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Reindex error:', error);
    return NextResponse.json(
      { error: 'Failed to reindex', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
