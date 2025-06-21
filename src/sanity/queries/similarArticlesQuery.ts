// src/sanity/queries/similarArticlesQuery.ts
import { groq } from 'next-sanity';

export const similarArticlesQuery = groq`
  *[_type == "post" && 
    category._ref == $categoryRef && 
    _id != $currentPostId && 
    defined(slug.current) && 
    defined(publishedAt)
  ] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    tags,
    category->{
      title,
      slug
    }
  }
`;

// Fallback query if no articles found in the same category
export const fallbackSimilarArticlesQuery = groq`
  *[_type == "post" && 
    _id != $currentPostId && 
    defined(slug.current) && 
    defined(publishedAt)
  ] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    tags,
    category->{
      title,
      slug
    }
  }
`;