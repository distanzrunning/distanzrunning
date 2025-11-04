import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import algoliasearch from 'algoliasearch';

// Initialize Algolia client
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);

// Get the appropriate index based on document type
function getIndexForType(type: string) {
  switch (type) {
    case 'post':
      return algoliaClient.initIndex('posts');
    case 'gearPost':
      return algoliaClient.initIndex('gear');
    case 'raceGuide':
      return algoliaClient.initIndex('races');
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
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "categoryTitle": category->title,
        "categorySlugs": category->slug.current,
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
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "gearCategoryTitle": gearCategory->title,
        "gearCategorySlugs": gearCategory->slug.current,
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
        "mainImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "raceCategoryTitle": raceCategory->title,
        "raceCategorySlugs": raceCategory->slug.current,
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

  return {
    objectID: doc._id,
    _type: doc._type,
    title: doc.title,
    slug: doc.slug?.current,
    excerpt: doc.excerpt,
    publishedAt: doc.publishedAt,
    mainImageUrl: doc.mainImageUrl,
    authorName: doc.authorName,
    categoryTitle: doc.categoryTitle || doc.gearCategoryTitle || doc.raceCategoryTitle,
    categorySlug: doc.categorySlugs || doc.gearCategorySlugs || doc.raceCategorySlugs,
    bodyText,
    _updatedAt: new Date().toISOString(),
  };
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

    // Get the appropriate Algolia index
    const index = getIndexForType(_type);
    if (!index) {
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
      await index.deleteObject(_id);
      return NextResponse.json(
        { message: 'Document removed from index' },
        { status: 200 }
      );
    }

    // Transform and index the document
    const algoliaDoc = transformForAlgolia(document);
    if (algoliaDoc) {
      await index.saveObject(algoliaDoc);
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

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Algolia sync webhook endpoint is running',
      supportedTypes: ['post', 'gearPost', 'raceGuide']
    },
    { status: 200 }
  );
}
