'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronRight, FiLoader } from 'react-icons/fi';

import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';
import CategoryBadge from '@/components/CategoryBadge';
import CategorySection from '@/components/CategorySection';
import { articleApi, categoryApi } from '@/lib/api';
import type { Article, Category } from '@/types/api';

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all required data in parallel
        const [featuredResponse, latestResponse, categoriesResponse] = await Promise.all([
          articleApi.getFeaturedArticles(),
          articleApi.getArticles({ limit: 8 }),
          categoryApi.getCategories(),
        ]);

        if (featuredResponse.success && featuredResponse.data) {
          setFeaturedArticles(featuredResponse.data.articles);
        }

        if (latestResponse.success && latestResponse.data) {
          setLatestArticles(latestResponse.data.articles);
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data.categories || []);
        }

        // Check if any critical data failed to load
        if (!featuredResponse.success || !latestResponse.success) {
          setError('Failed to load some content. Please refresh the page.');
        }
      } catch (err) {
        setError('Failed to load content. Please check your connection and try again.');
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const mainFeatured = featuredArticles[0];
  const sideFeatured = featuredArticles.slice(1, 4);

  return (
    <div className="pb-16">
      {/* Hero Section with Featured Articles */}
      <section className="bg-gray-50 py-12 mb-12">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-gray-800 uppercase tracking-wider text-sm font-semibold mb-4">
              Welcome to News Website
            </h2>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Craft narratives ✍️ that ignite <span className="text-primary">inspiration</span> 🌟,{' '}
              <span className="text-primary">knowledge</span> 📚, and <span className="text-primary">entertainment</span> 🎬
            </h1>
          </div>
          
          {/* Featured Articles */}
          {mainFeatured && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Main Featured Article */}
              <div className="rounded-lg overflow-hidden shadow-md">
                <Link href={`/article/${mainFeatured.slug}`} className="block relative aspect-video">
                  <Image
                    src={mainFeatured.image.url}
                    alt={mainFeatured.image.alt}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="p-6 bg-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <CategoryBadge category={mainFeatured.category} />
                    <span className="text-gray-500 text-xs">• {mainFeatured.timeAgo}</span>
                  </div>
                  <Link href={`/article/${mainFeatured.slug}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                      {mainFeatured.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-2">{mainFeatured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                        {mainFeatured.author.initials}
                      </div>
                      <span className="text-sm text-gray-700">{mainFeatured.author.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>{mainFeatured.readTime} min read • {mainFeatured.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Side Featured Articles */}
              <div className="space-y-4">
                {sideFeatured.map((article) => (
                  <div key={article.id} className="flex bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="w-1/3 relative aspect-square">
                      <Link href={`/article/${article.slug}`} className="block h-full">
                        <Image
                          src={article.image.url}
                          alt={article.image.alt}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CategoryBadge category={article.category} size="sm" />
                        <span className="text-gray-500 text-xs">• {article.timeAgo}</span>
                      </div>
                      <Link href={`/article/${article.slug}`}>
                        <h3 className="font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.excerpt}</p>
                      <div className="text-xs text-gray-500">
                        <span>{article.readTime} min read • {article.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mb-16">
          <SectionHeader 
            title="Browse Categories" 
            viewAllLink="/categories"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors text-center"
              >
                <div className="mb-2">
                  <span className="text-2xl">{getCategoryIcon(category.icon)}</span>
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest News Section */}
      <section className="container mb-16">
        <SectionHeader 
          title="Latest News" 
          viewAllLink="/articles"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestArticles.slice(0, 8).map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
            />
          ))}
        </div>
      </section>

      {/* Dynamic Category Sections */}
      {categories.slice(0, 6).map((category) => (
        <CategorySection 
          key={category.id} 
          category={category} 
          limit={4}
        />
      ))}

      {/* Newsletter Subscription */}
      <section className="bg-gradient-to-r from-primary to-secondary py-12 mb-16">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Updated with Latest News
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest news delivered straight to your inbox. No spam, unsubscribe at any time.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function for category icons
function getCategoryIcon(iconName: string) {
  const icons: { [key: string]: string } = {
    technology: '💻',
    business: '💼',
    sports: '🏆',
    entertainment: '🎬',
    health: '🏥',
    science: '🔬',
    politics: '🏛️',
    world: '🌍',
    lifestyle: '🌟',
    food: '🍽️',
    travel: '✈️',
    default: '📰'
  };
  
  return icons[iconName.toLowerCase()] || icons.default;
} 