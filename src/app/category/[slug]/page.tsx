'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiLoader, FiGrid, FiList, FiFilter, FiSearch, FiCalendar, FiEye, FiClock, FiTrendingUp, FiBookOpen } from 'react-icons/fi';

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
    sort?: string;
    search?: string;
  };
}

type ViewMode = 'grid' | 'list';
type SortOption = 'latest' | 'popular' | 'trending' | 'oldest';

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const page = Number(searchParams.page || '1');
  const sortParam = (searchParams.sort as SortOption) || 'latest';
  const searchQuery = searchParams.search || '';
  
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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  const sortOptions = [
    { value: 'latest', label: 'الأحدث', icon: FiCalendar },
    { value: 'popular', label: 'الأكثر مشاهدة', icon: FiEye },
    { value: 'trending', label: 'المتداول', icon: FiTrendingUp },
    { value: 'oldest', label: 'الأقدم', icon: FiClock },
  ];

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
  }, [slug, page, sortBy, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the URL with search params
    // For now, we'll just trigger the useEffect
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600 text-lg">جاري تحميل المقالات...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center space-x-2 text-sm mb-8 opacity-90">
              <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-primary transition-colors">التصنيفات</Link>
              <span>/</span>
              <span className="text-gray-300">{category.name}</span>
            </nav>

            {/* Category Icon and Title */}
            <div className="flex items-center justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl mr-6 shadow-2xl"
                style={{ backgroundColor: category.color }}
              >
                <FiBookOpen />
              </div>
              <div className="text-right">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">{category.name}</h1>
                <p className="text-lg text-gray-200">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">{pagination.total}</div>
                <div className="text-sm text-gray-300">مقال متاح</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">{pagination.pages}</div>
                <div className="text-sm text-gray-300">صفحة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">
                  {articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">إجمالي المشاهدات</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container py-8">

        {/* Articles Grid/List */}
        {articles.length > 0 ? (
          <>
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "space-y-6"
            }>
              {articles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  size={viewMode === 'list' ? 'large' : 'medium'}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    basePath={`/category/${slug}`}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مقالات</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `لم يتم العثور على مقالات تحتوي على "${searchTerm}" في هذا التصنيف.`
                  : 'لا توجد مقالات في هذا التصنيف حالياً.'
                }
              </p>
              <div className="space-y-3">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    مسح البحث
                  </button>
                )}
                <Link 
                  href="/" 
                  className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  العودة إلى الرئيسية
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">تصنيفات أخرى</h2>
            <p className="text-gray-600">اكتشف المزيد من المحتوى في تصنيفات مختلفة</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* This would be populated with other categories */}
            {['رياضة', 'سياسة', 'أعمال', 'ترفيه', 'صحة'].map((cat, index) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 transition-all duration-200 text-center"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                  index % 2 === 0 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                }`}>
                  <FiBookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {cat}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 