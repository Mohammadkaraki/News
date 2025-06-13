'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';

import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import { articleApi, categoryApi } from '@/lib/api';
import type { Article, Category } from '@/types/api';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const page = Number(searchParams.page || '1');
  
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category info and articles in parallel
        const [categoryResponse, articlesResponse] = await Promise.all([
          categoryApi.getCategoryBySlug(slug),
          articleApi.getArticlesByCategory(slug, page)
        ]);

        if (categoryResponse.success && categoryResponse.data?.category) {
          setCategory(categoryResponse.data.category);
        } else {
          setError('Category not found');
          return;
        }

        if (articlesResponse.success && articlesResponse.data?.articles) {
          setArticles(articlesResponse.data.articles);
          setPagination(articlesResponse.data.pagination);
        } else {
          setError('Failed to load articles');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    notFound();
  }

  return (
    <div className="container py-12">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mr-4"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-4">
          {category.description}
        </p>
        <p className="text-sm text-gray-500">
          {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} found
        </p>
      </header>
      
      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          
          {/* Show pagination if there are multiple pages */}
          {pagination.pages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                basePath={`/category/${slug}`}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No articles found in this category.</p>
          <a 
            href="/" 
            className="text-primary hover:text-primary/80 font-medium"
          >
            ← Back to homepage
          </a>
        </div>
      )}
    </div>
  );
} 