// src/app/articles/page.tsx
import { client as sanity } from '@/sanity/lib/client';
import ArticleCard from '@/components/ArticleCard';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
  excerpt: string;
  categories: Array<{ title: string }>;
};

export default async function ArticlesPage() {
  const posts: Post[] = await sanity.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id, 
      title, 
      slug,
      mainImage,
      publishedAt,
      excerpt,
      "categories": categories[]->title
    }
  `);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Articles</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}