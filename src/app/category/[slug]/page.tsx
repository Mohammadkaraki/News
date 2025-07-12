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

// Helper for random large numbers
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    <div className="min-h-screen bg-gray-50 font-cairo">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 text-white overflow-hidden min-h-[28vh] flex flex-col justify-end pb-8">
        {/* Animated Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="relative container py-8 md:py-10 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-x-2 text-xs mb-4 opacity-90 font-cairo">
              <span className="bg-white/10 px-2 py-1 rounded-full text-white/80"><Link href="/" className="hover:text-blue-200 transition-colors">الرئيسية</Link></span>
              <span className="text-blue-200">/</span>
              <span className="bg-white/10 px-2 py-1 rounded-full text-white/80"><Link href="/categories" className="hover:text-blue-200 transition-colors">التصنيفات</Link></span>
              <span className="text-blue-200">/</span>
              <span className="bg-white/10 px-2 py-1 rounded-full text-white font-bold">{category.name}</span>
            </nav>

            {/* Category Icon and Title */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-500 to-blue-800 p-1 rounded-2xl shadow-xl flex items-center justify-center">
                  <div className="w-full h-full bg-white/90 rounded-xl flex items-center justify-center">
                    <FiBookOpen className="text-blue-700 w-8 h-8" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 font-cairo bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">{category.name}</h1>
              <p className="text-sm md:text-base text-blue-100 font-cairo max-w-xl mx-auto">{category.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-lg">
                <div className="text-xl font-bold text-blue-200 font-cairo">{pagination.total}</div>
                <div className="text-xs text-blue-100 font-cairo">مقال متاح</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-lg">
                <div className="text-xl font-bold text-blue-200 font-cairo">{pagination.pages}</div>
                <div className="text-xs text-blue-100 font-cairo">صفحة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-lg">
                <div className="text-xl font-bold text-blue-200 font-cairo">{getRandomInt(50000, 250000).toLocaleString()}</div>
                <div className="text-xs text-blue-100 font-cairo">إجمالي المشاهدات</div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-cairo">تصنيفات أخرى</h2>
            <p className="text-gray-600 font-cairo">اكتشف المزيد من المحتوى في تصنيفات مختلفة</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['رياضة', 'سياسة', 'أعمال', 'ترفيه', 'صحة'].map((cat, index) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="group relative bg-gradient-to-br from-blue-50/60 via-white/80 to-blue-100/60 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 hover:border-blue-200 text-center p-6"
              >
                {/* Gradient Border Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="absolute inset-[2px] bg-white rounded-2xl"></div>
                {/* Icon Container */}
                <div className="relative z-10 mb-3">
                  <div className={`w-12 h-12 mx-auto bg-gradient-to-br from-blue-200 via-blue-400 to-indigo-300 rounded-xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 shadow-md`}>
                    <FiBookOpen className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
                {/* Category Name */}
                <h3 className="font-semibold text-base text-gray-900 group-hover:text-primary transition-colors font-cairo z-10 relative">
                  {cat}
                </h3>
                {/* Accent Bar */}
                <div className="absolute bottom-4 left-6 right-6 h-0.5 bg-gradient-to-r from-primary via-blue-400 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 