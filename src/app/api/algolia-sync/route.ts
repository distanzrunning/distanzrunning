// src/app/api/algolia-sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { algoliasearch } from 'algoliasearch'
import { createClient } from 'next-sanity'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
})

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
)

const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'distanz_content'

// Define what gets indexed from each document type
async function transformDocument(doc: any) {
  const baseObject = {
    objectID: doc._id,
    title: doc.title,
    slug: doc.slug?.current,
    _type: doc._type,
    publishedAt: doc.publishedAt || doc._createdAt,
  }

  // Add type-specific fields
  if (doc._type === 'post' || doc._type === 'gearPost') {
    return {
      ...baseObject,
      excerpt: doc.excerpt,
      category: doc.category?.title,
      author: doc.author?.name,
      mainImage: doc.mainImage?.asset?._ref,
    }
  }

  if (doc._type === 'raceGuide') {
    return {
      ...baseObject,
      location: doc.location,
      eventDate: doc.eventDate,
      distance: doc.distance,
      category: doc.category?.title,
    }
  }

  return baseObject
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Sanity webhook sends the document ID
    const { _id } = body

    if (!_id) {
      return NextResponse.json({ error: 'No document ID provided' }, { status: 400 })
    }

    // Fetch the full document from Sanity
    const query = `*[_id == $id][0]{
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
      location,
      eventDate,
      distance
    }`

    const document = await sanityClient.fetch(query, { id: _id })

    if (!document) {
      // Document was deleted, remove from Algolia
      await algoliaClient.deleteObject({
        indexName,
        objectID: _id
      })
      return NextResponse.json({ message: 'Document removed from index' })
    }

    // Transform and index the document
    const algoliaObject = await transformDocument(document)
    await algoliaClient.saveObject({
      indexName,
      body: algoliaObject
    })

    return NextResponse.json({
      message: 'Document indexed successfully',
      objectID: algoliaObject.objectID
    })

  } catch (error) {
    console.error('Algolia sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync to Algolia', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Optional: Endpoint to do a full reindex of all content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const secret = searchParams.get('secret')

    // Protect this endpoint
    if (secret !== process.env.REINDEX_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all published posts, gear posts, and race guides
    const query = `*[_type in ["post", "gearPost", "raceGuide"] && !(_id in path("drafts.**"))]{
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
      location,
      eventDate,
      distance
    }`

    const documents = await sanityClient.fetch(query)

    const algoliaObjects = await Promise.all(
      documents.map((doc: any) => transformDocument(doc))
    )

    await algoliaClient.saveObjects({
      indexName,
      objects: algoliaObjects
    })

    return NextResponse.json({
      message: 'Full reindex completed',
      count: algoliaObjects.length
    })

  } catch (error) {
    console.error('Reindex error:', error)
    return NextResponse.json(
      { error: 'Failed to reindex', details: (error as Error).message },
      { status: 500 }
    )
  }
}
