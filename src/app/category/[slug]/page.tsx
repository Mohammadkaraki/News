import { notFound } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import { articles, categories } from '@/data/mockData';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const page = Number(searchParams.page || '1');
  const pageSize = 9;
  
  // Find the category by slug
  const category = categories.find((c) => c.slug === slug);
  
  // If category doesn't exist, return 404
  if (!category) {
    notFound();
  }
  
  // Filter articles by category
  const categoryArticles = articles.filter(
    (article) => article.category.slug === slug
  );
  
  // Pagination logic
  const totalPages = Math.ceil(categoryArticles.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = categoryArticles.slice(startIndex, endIndex);
  
  return (
    <div className="container py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse the latest news and articles in {category.name.toLowerCase()}.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {/* Show pagination if there are multiple pages */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/category/${slug}`}
        />
      )}
    </div>
  );
} 