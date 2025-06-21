'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import CategoryBadge from '@/components/CategoryBadge';
import Pagination from '@/components/Pagination';
import { articleApi, categoryApi } from '@/lib/api';
import type { Article, Category } from '@/types/api';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const pageParam = searchParams.get('page');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update current page from URL
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page);
  }, [pageParam]);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory, section]);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.success && response.data) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 12
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (section === 'must-read') {
        params.featured = true;
      } else if (section === 'editors-pick') {
        params.editorsPick = true;
      }

      const response = await articleApi.getArticles(params);
      
      if (response.success && response.data) {
        setArticles(response.data.articles);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalArticles(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? '' : categorySlug);
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    if (section === 'must-read') return 'Must Read Articles';
    if (section === 'editors-pick') return "Editor's Pick";
    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      return `${category?.name} Articles`;
    }
    return 'All Articles';
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600">
          {section === 'must-read' && 'Essential reading from our editorial team'}
          {section === 'editors-pick' && "Hand-picked stories by our editors"}
          {!section && `Discover ${totalArticles} articles across all categories`}
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryFilter('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.slug
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedCategory === category.slug ? category.color : undefined
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(12).fill(null).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded"></div>
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/articles"
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">
            {selectedCategory 
              ? `No articles found in the ${categories.find(c => c.slug === selectedCategory)?.name} category.`
              : 'No articles available at the moment.'
            }
          </p>
        </div>
      )}
    </div>
  );
} 