'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryApi, articleApi } from '@/lib/api';
import type { Category, Article } from '@/types/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStats, setCategoryStats] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesWithStats();
  }, []);

  const fetchCategoriesWithStats = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const categoriesResponse = await categoryApi.getCategories();
      if (categoriesResponse.success && categoriesResponse.data) {
        const cats = categoriesResponse.data.categories;
        setCategories(cats);
        
        // Fetch article counts for each category
        const stats: {[key: string]: number} = {};
        for (const category of cats) {
          try {
            const articlesResponse = await articleApi.getArticles({
              category: category.slug,
              limit: 1
            });
            if (articlesResponse.success && articlesResponse.data) {
              stats[category.slug] = articlesResponse.data.pagination?.total || 0;
            }
          } catch (error) {
            console.error(`Error fetching stats for ${category.name}:`, error);
            stats[category.slug] = 0;
          }
        }
        setCategoryStats(stats);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, string> = {
      laptop: '💻',
      trophy: '🏆',
      building: '🏛️',
      briefcase: '💼',
      film: '🎬',
      heart: '❤️',
      globe: '🌍',
      car: '🚗',
      home: '🏠',
      book: '📚',
      default: '📰',
    };
    
    return icons[iconName] || icons.default;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          تصفح الفئات
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          استكشف مجموعتنا الشاملة من فئات الأخبار. من التكنولوجيا إلى الرياضة، 
          اعثر على المواضيع التي تهمك أكثر.
        </p>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(null).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl p-6 h-40"></div>
            </div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group block"
            >
              <div 
                className="relative overflow-hidden rounded-xl p-6 h-40 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}10 100%)`
                }}
              >
                {/* Category Icon */}
                <div className="flex items-center justify-between">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: category.color }}
                  >
                    {getCategoryIcon(category.icon)}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      {categoryStats[category.slug] || 0}
                    </div>
                    <div className="text-xs text-gray-500">articles</div>
                  </div>
                </div>

                {/* Category Info */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {category.description || `Latest news and updates in ${category.name.toLowerCase()}`}
                  </p>
                </div>

                {/* Hover Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"
                  style={{ backgroundColor: category.color }}
                ></div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">
            Categories will appear here once they are created.
          </p>
        </div>
      )}

      {/* Featured Categories Section */}
      {!loading && categories.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories
              .sort((a, b) => (categoryStats[b.slug] || 0) - (categoryStats[a.slug] || 0))
              .slice(0, 4)
              .map((category) => (
                <Link
                  key={`popular-${category.id}`}
                  href={`/category/${category.slug}`}
                  className="group text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3"
                    style={{ backgroundColor: category.color }}
                  >
                    {getCategoryIcon(category.icon)}
                  </div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-gray-700">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {categoryStats[category.slug] || 0} articles
                  </p>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 