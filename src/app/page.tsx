'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronRight, FiLoader } from 'react-icons/fi';

import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';
import CategoryBadge from '@/components/CategoryBadge';
import { articleApi, categoryApi } from '@/lib/api';
import { getSafeImageProps } from '@/lib/imageUtils';
import type { Article, Category } from '@/types/api';

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [businessArticles, setBusinessArticles] = useState<Article[]>([]);
  const [sportsArticles, setSportsArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories first to get their slugs
        const categoriesResponse = await categoryApi.getCategories();
        let businessSlug = '';
        let sportsSlug = '';
        
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data.categories || []);
          
          // Find business and sports category slugs
          const categories = categoriesResponse.data.categories || [];
          const businessCategory = categories.find(
            cat => cat.name.toLowerCase().includes('business') || cat.slug === 'business'
          );
          const sportsCategory = categories.find(
            cat => cat.name.toLowerCase().includes('sport') || cat.slug === 'sports' || cat.slug === 'sport'
          );
          
          businessSlug = businessCategory?.slug || '';
          sportsSlug = sportsCategory?.slug || '';
        }

        // Fetch all required data in parallel
        const promises = [
          articleApi.getFeaturedArticles(),
          articleApi.getArticles({ limit: 8 }),
        ];

        // Add category-specific requests if we found the categories
        if (businessSlug) {
          promises.push(articleApi.getArticles({ category: businessSlug, limit: 3 }));
        }
        if (sportsSlug) {
          promises.push(articleApi.getArticles({ category: sportsSlug, limit: 4 }));
        }

        const responses = await Promise.all(promises);
        
        const [featuredResponse, latestResponse, ...categoryResponses] = responses;

        if (featuredResponse.success && featuredResponse.data) {
          setFeaturedArticles(featuredResponse.data.articles);
        }

        if (latestResponse.success && latestResponse.data) {
          setLatestArticles(latestResponse.data.articles);
        }

        // Set category-specific articles
        let responseIndex = 0;
        if (businessSlug && categoryResponses[responseIndex]) {
          if (categoryResponses[responseIndex].success && categoryResponses[responseIndex].data) {
            setBusinessArticles(categoryResponses[responseIndex].data.articles || []);
          }
          responseIndex++;
        }
        if (sportsSlug && categoryResponses[responseIndex]) {
          if (categoryResponses[responseIndex].success && categoryResponses[responseIndex].data) {
            setSportsArticles(categoryResponses[responseIndex].data.articles || []);
          }
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
      {/* Hero Section */}
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
                    {...getSafeImageProps(
                      mainFeatured.image?.url || '',
                      mainFeatured.image?.alt || mainFeatured.title,
                      mainFeatured.category?.name
                    )}
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
                        {mainFeatured.author?.initials || 'U'}
                      </div>
                      <span className="text-sm text-gray-700">{mainFeatured.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>{mainFeatured.readTime || 1} min read • {mainFeatured.views || 0} views</span>
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
                          {...getSafeImageProps(
                            article.image?.url || '',
                            article.image?.alt || article.title,
                            article.category?.name
                          )}
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

      {/* Brand Story Section */}
      <section className="container mb-16">
        <SectionHeader 
          title="News Story" 
          viewAllLink="#"
        />
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6 items-center opacity-60">
            {/* Brand Logos */}
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">BBC</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">CNN</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">FOX</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">NBC</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">AP</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">NYT</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">ABC</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">CBS</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">PBS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Must Read Section */}
      <section className="container mb-16">
        <SectionHeader 
          title="Must Read" 
          viewAllLink="/articles?section=must-read"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Article - Takes 8 columns */}
          {latestArticles.slice(0, 1).map((article) => (
            <div key={article.id} className="lg:col-span-8">
              <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Link href={`/article/${article.slug}`} className="block h-full">
                    <Image
                      src={article.image.url}
                      alt={article.image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </Link>
                  {/* Category Badge on Image */}
                  <div className="absolute top-6 left-6">
                    <CategoryBadge category={article.category} />
                  </div>
                  {/* Featured Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      🔥 Must Read
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-gray-500 text-sm">📅 {article.timeAgo}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">⏱️ {article.readTime} min read</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">👁️ {article.views || 0} views</span>
                  </div>
                  
                  <Link href={`/article/${article.slug}`}>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900 hover:text-primary transition-colors line-clamp-2 group-hover:text-primary">
                      {article.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-lg mb-6 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {article.author.initials}
                      </div>
                      <div>
                        <span className="text-gray-900 font-semibold">{article.author.name}</span>
                        <p className="text-gray-500 text-sm">Senior Editor</p>
                      </div>
                    </div>
                    <Link 
                      href={`/article/${article.slug}`}
                      className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group"
                    >
                      Read More 
                      <FiChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Side Articles - Takes 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Trending Stories
              </h4>
              
              <div className="space-y-4">
                {latestArticles.slice(1, 4).map((article, index) => (
                  <article key={article.id} className="group">
                    <div className="flex space-x-4">
                      {/* Article Number */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 2}
                        </div>
                      </div>
                      
                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <CategoryBadge category={article.category} size="sm" />
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-gray-500 text-xs">{article.timeAgo}</span>
                        </div>
                        
                        <Link href={`/article/${article.slug}`}>
                          <h5 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2">
                            {article.title}
                          </h5>
                        </Link>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>👁️ {article.views || 0} views</span>
                          <span>⏱️ {article.readTime}m read</span>
                        </div>
                      </div>
                      
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        <Link href={`/article/${article.slug}`} className="block relative w-20 h-20 rounded-lg overflow-hidden">
                          <Image
                            src={article.image.url}
                            alt={article.image.alt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                    </div>
                    
                    {/* Divider (except for last item) */}
                    {index < 2 && (
                      <hr className="my-4 border-gray-200" />
                    )}
                  </article>
                ))}
              </div>
              
              {/* View All Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link 
                  href="/articles?section=must-read"
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-white text-primary font-semibold rounded-lg border border-primary hover:bg-primary hover:text-white transition-all duration-300 group"
                >
                  View All Must Read Articles
                  <FiChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Popular This Week Widget */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🔥</span>
                Popular This Week
              </h4>
              
              <div className="space-y-3">
                {latestArticles.slice(4, 7).map((article, index) => (
                  <div key={article.id} className="flex items-center space-x-3 group">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/article/${article.slug}`}>
                        <h6 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors text-sm">
                          {article.title}
                        </h6>
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">👁️ {article.views || 0}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{article.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editor's Pick Section */}
      <section className="container mb-16">
        <SectionHeader 
          title="Editor's Pick" 
          viewAllLink="/articles?section=editors-pick"
        />
        
        <div className="space-y-6">
          {/* Main featured article */}
          {latestArticles.slice(4, 5).map((article) => (
            <div key={article.id} className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg overflow-hidden shadow-md">
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div className="order-2 md:order-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <CategoryBadge category={article.category} />
                    <span className="text-gray-500 text-xs">• {article.timeAgo}</span>
                  </div>
                  <Link href={`/article/${article.slug}`}>
                    <h3 className="text-2xl font-bold mb-4 hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-gray-700 mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                        {article.author.initials}
                      </div>
                      <span className="text-sm text-gray-700">{article.author.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 relative aspect-video">
                  <Link href={`/article/${article.slug}`} className="block h-full">
                    <Image
                      src={article.image.url}
                      alt={article.image.alt}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Secondary articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestArticles.slice(5, 9).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Business Section */}
      {businessArticles.length > 0 && (
        <section className="container mb-16">
          <SectionHeader 
            title="Business" 
            viewAllLink="/category/business"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Link href={`/article/${article.slug}`} className="block relative aspect-video">
                <Image
                  src={article.image.url}
                  alt={article.image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    💼 Business
                  </span>
                </div>
              </Link>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-gray-500 text-xs">{article.timeAgo}</span>
                </div>
                <Link href={`/article/${article.slug}`}>
                  <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                      {article.author.initials}
                    </div>
                    <span className="text-sm text-gray-700">{article.author.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </section>
      )}

      {/* Sport News Section */}
      {sportsArticles.length > 0 && (
        <section className="container mb-16">
          <SectionHeader 
            title="Sport News" 
            viewAllLink="/category/sports"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sportsArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Link href={`/article/${article.slug}`} className="block relative aspect-video">
                <Image
                  src={article.image.url}
                  alt={article.image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    🏆 Sports
                  </span>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-500 text-xs">{article.timeAgo}</span>
                </div>
                <Link href={`/article/${article.slug}`}>
                  <h3 className="font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                      {article.author.initials}
                    </div>
                    <span className="text-xs text-gray-700">{article.author.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span>{article.readTime}m</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </section>
      )}

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

      {/* Statistics */}
      <section className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">{latestArticles.length}+</div>
            <div className="text-gray-600">Articles Published</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">{categories.length}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">
              {latestArticles.reduce((sum, article) => sum + article.views, 0)}
            </div>
            <div className="text-gray-600">Total Views</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-600">News Coverage</div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function to get category icons
function getCategoryIcon(iconName: string) {
  const icons: Record<string, string> = {
    laptop: '💻',
    trophy: '🏆',
    building: '🏛️',
    briefcase: '💼',
    film: '🎬',
    heart: '❤️',
    default: '📰',
  };
  
  return icons[iconName] || icons.default;
} 