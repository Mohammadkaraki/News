'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronRight, FiLoader, FiTrendingUp, FiClock, FiEye } from 'react-icons/fi';

import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';
import CategoryBadge from '@/components/CategoryBadge';
import { articleApi, categoryApi } from '@/lib/api';
import { getSafeImageProps, getSafeAuthorInfo } from '@/lib/imageUtils';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import type { Article, Category } from '@/types/api';

// Helper for random large numbers
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [worldArticles, setWorldArticles] = useState<Article[]>([]);
  const [politicsArticles, setPoliticsArticles] = useState<Article[]>([]);
  const [businessArticles, setBusinessArticles] = useState<Article[]>([]);
  const [sportsArticles, setSportsArticles] = useState<Article[]>([]);
  const [entertainmentArticles, setEntertainmentArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newArticleNotification, setNewArticleNotification] = useState<Article | null>(null);

  // Handle new article from real-time updates
  const handleNewArticle = useCallback((newArticle: Article) => {
    console.log('🆕 New article received via WebSocket:', newArticle.title);
    
    // Show notification
    setNewArticleNotification(newArticle);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNewArticleNotification(null);
    }, 5000);
    
    // Add to latest articles (at the beginning)
    setLatestArticles(prev => [newArticle, ...prev.slice(0, 7)]);
    
    // If it's from world or politics category, add to featured
    if (newArticle.category.slug === 'world' || newArticle.category.slug === 'politics') {
      setFeaturedArticles(prev => [newArticle, ...prev.slice(0, 3)]);
    }
    
    // Add to category-specific arrays
    if (newArticle.category.slug === 'world') {
      setWorldArticles(prev => [newArticle, ...prev.slice(0, 7)]);
    } else if (newArticle.category.slug === 'politics') {
      setPoliticsArticles(prev => [newArticle, ...prev.slice(0, 3)]);
    } else if (newArticle.category.slug === 'business') {
      setBusinessArticles(prev => [newArticle, ...prev.slice(0, 2)]);
    } else if (newArticle.category.slug === 'sports') {
      setSportsArticles(prev => [newArticle, ...prev.slice(0, 3)]);
    } else if (newArticle.category.slug === 'entertainment') {
      setEntertainmentArticles(prev => [newArticle, ...prev.slice(0, 3)]);
    }
  }, []);

  // Initialize real-time updates
  const { } = useRealTimeUpdates({
    onNewArticle: handleNewArticle,
    onError: (error) => {
      console.error('WebSocket error:', error);
    },
    enabled: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories first to get their slugs
        const categoriesResponse = await categoryApi.getCategories();
        let worldSlug = '';
        let politicsSlug = '';
        let businessSlug = '';
        let sportsSlug = '';
        let entertainmentSlug = '';
        
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data.categories || []);
          
          // Find all category slugs
          const categories = categoriesResponse.data.categories || [];
          const worldCategory = categories.find(cat => cat.slug === 'world');
          const politicsCategory = categories.find(cat => cat.slug === 'politics');
          const businessCategory = categories.find(cat => cat.slug === 'business');
          const sportsCategory = categories.find(cat => cat.slug === 'sports');
          const entertainmentCategory = categories.find(cat => cat.slug === 'entertainment');
          
          worldSlug = worldCategory?.slug || '';
          politicsSlug = politicsCategory?.slug || '';
          businessSlug = businessCategory?.slug || '';
          sportsSlug = sportsCategory?.slug || '';
          entertainmentSlug = entertainmentCategory?.slug || '';
        }

        // Fetch all required data in parallel
        const promises = [
          articleApi.getArticles({ limit: 8 }), // Latest articles for general use
        ];

        // Add category-specific requests if we found the categories
        if (worldSlug) {
          promises.push(articleApi.getArticles({ category: worldSlug, limit: 8 }));
        }
        if (politicsSlug) {
          promises.push(articleApi.getArticles({ category: politicsSlug, limit: 4 }));
        }
        if (businessSlug) {
          promises.push(articleApi.getArticles({ category: businessSlug, limit: 3 }));
        }
        if (sportsSlug) {
          promises.push(articleApi.getArticles({ category: sportsSlug, limit: 4 }));
        }
        if (entertainmentSlug) {
          promises.push(articleApi.getArticles({ category: entertainmentSlug, limit: 4 }));
        }

        const responses = await Promise.all(promises);
        
        const [latestResponse, ...categoryResponses] = responses;

        if (latestResponse.success && latestResponse.data) {
          setLatestArticles(latestResponse.data.articles);
        }

        // Set category-specific articles
        let responseIndex = 0;
        if (worldSlug && categoryResponses[responseIndex]) {
          if (categoryResponses[responseIndex].success && categoryResponses[responseIndex].data) {
            setWorldArticles(categoryResponses[responseIndex].data?.articles || []);
          }
          responseIndex++;
        }
        if (politicsSlug && categoryResponses[responseIndex]) {
          if (categoryResponses[responseIndex].success && categoryResponses[responseIndex].data) {
            setPoliticsArticles(categoryResponses[responseIndex].data?.articles || []);
          }
          responseIndex++;
        }
        if (businessSlug && categoryResponses[responseIndex]) {
          if (categoryResponses[responseIndex].success && categoryResponses[responseIndex].data) {
            setBusinessArticles(categoryResponses[responseIndex].data?.articles || []);
          }
          responseIndex++;
        }
        if (sportsSlug && categoryResponses[responseIndex]) {
          if (categoryResponses[responseIndex].success && categoryResponses[responseIndex].data) {
            setSportsArticles(categoryResponses[responseIndex].data?.articles || []);
          }
          responseIndex++;
        }
        if (entertainmentSlug && categoryResponses[responseIndex]) {
          if (categoryResponses[responseIndex].success && categoryResponses[responseIndex].data) {
            setEntertainmentArticles(categoryResponses[responseIndex].data?.articles || []);
          }
        }

        // Set featured articles as combination of world and politics articles
        let worldArticlesData: Article[] = [];
        let politicsArticlesData: Article[] = [];
        
        responseIndex = 0;
        if (worldSlug && categoryResponses[responseIndex]) {
          worldArticlesData = categoryResponses[responseIndex].data?.articles || [];
          responseIndex++;
        }
        if (politicsSlug && categoryResponses[responseIndex]) {
          politicsArticlesData = categoryResponses[responseIndex].data?.articles || [];
        }
        
        const combinedFeatured = [...worldArticlesData, ...politicsArticlesData]
          .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
          .slice(0, 4);
        setFeaturedArticles(combinedFeatured);

        // Check if any critical data failed to load
        if (!latestResponse.success) {
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
          <p className="text-gray-600 font-arabic">جاري تحميل أحدث الأخبار...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4 font-arabic">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-arabic"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const mainFeatured = featuredArticles[0];
  const sideFeatured = featuredArticles.slice(1, 4);

  return (
    <div className="pb-16">


      {/* New Article Notification */}
      {newArticleNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-white border border-primary/20 rounded-lg shadow-lg p-4 animate-slide-in-right">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary font-semibold text-sm font-heading">مقال جديد</span>
                  <CategoryBadge category={newArticleNotification.category} size="sm" />
                </div>
                <Link 
                  href={`/article/${newArticleNotification.slug}`}
                  className="block"
                  onClick={() => setNewArticleNotification(null)}
                >
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary transition-colors font-heading">
                    {newArticleNotification.title}
                  </h4>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-1 font-arabic">
                    {newArticleNotification.excerpt}
                  </p>
                </Link>
                <button
                  onClick={() => setNewArticleNotification(null)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="إغلاق الإشعار"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spectacular Hero Section */}
      <section className="relative h-[30vh] min-h-[240px] max-h-[350px] overflow-hidden">
        {/* Dynamic Background System */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 via-blue-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/15 via-transparent to-indigo-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        
        {/* Animated Mesh Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>
        
                 {/* Spectacular Animated Elements */}
         <div className="absolute inset-0 overflow-hidden">
           {/* Main Orbs */}
           <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/25 via-indigo-600/15 to-blue-700/20 rounded-full blur-3xl animate-pulse opacity-80"></div>
           <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/20 to-blue-800/15 rounded-full blur-3xl animate-pulse delay-1000 opacity-70"></div>
           
           {/* Secondary Orbs */}
           <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-full blur-2xl animate-pulse delay-500"></div>
           <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-gradient-to-r from-blue-400/15 to-indigo-500/15 rounded-full blur-xl animate-pulse delay-2000"></div>
           
           {/* Floating Particles */}
           <div className="absolute top-20 left-1/5 w-4 h-4 bg-blue-400/60 rounded-full animate-bounce opacity-80 delay-300"></div>
           <div className="absolute top-32 right-1/3 w-3 h-3 bg-indigo-400/50 rounded-full animate-bounce opacity-70 delay-700"></div>
           <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-blue-300/60 rounded-full animate-bounce opacity-60 delay-1100"></div>
           <div className="absolute bottom-40 right-1/5 w-3.5 h-3.5 bg-blue-500/50 rounded-full animate-bounce opacity-50 delay-1500"></div>
         </div>
        
                 {/* Content Container */}
         <div className="relative container h-full flex items-center py-4">
           <div className="w-full">
             <div className="grid lg:grid-cols-12 gap-6 items-center">
               {/* Main Content */}
               <div className="lg:col-span-7">
                 {/* Premium Badge */}
                 <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-blue-600/20 backdrop-blur-xl rounded-full text-xs font-medium mb-3 border border-blue-400/30 shadow-2xl shadow-blue-500/20">
                   <div className="relative mr-2">
                     <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse"></div>
                     <div className="absolute inset-0 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-ping opacity-75"></div>
                   </div>
                   <span className="font-heading bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                     🏆 المصدر الأول للأخبار العربية
                   </span>
                 </div>
                 
                 {/* Main Headline */}
                 <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight font-heading">
                   <span className="bg-gradient-to-r from-white via-gray-50 to-white bg-clip-text text-transparent drop-shadow-2xl">
                     أحدث الأخبار من
                   </span>
                   <span className="bg-gradient-to-r from-blue-300 via-indigo-300 via-blue-400 to-blue-300 bg-clip-text text-transparent animate-pulse">
                     {' '}جميع أنحاء العالم
                   </span>
                 </h1>
                 
                 {/* Description */}
                 <p className="text-sm md:text-base text-blue-100 mb-4 max-w-lg font-arabic leading-relaxed opacity-95">
                   تغطية شاملة وحصرية للأخبار العالمية مع
                   <span className="text-blue-300 font-semibold"> تحديثات لحظية</span> 
                   و
                   <span className="text-indigo-300 font-semibold"> تحليل عميق</span>
                 </p>
                 
                 {/* CTA Buttons */}
                 <div className="flex flex-wrap gap-3 mb-3">
                   <button 
                     onClick={() => {
                       const featuredSection = document.getElementById('featured-articles-section');
                       if (featuredSection) {
                         featuredSection.scrollIntoView({ behavior: 'smooth' });
                       }
                     }}
                     className="group relative inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary via-pink-600 to-secondary text-white rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 font-arabic overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-pink-700 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     <span className="relative">اكتشف الأخبار</span>
                     <FiChevronRight className="relative mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                   </button>
                   <button 
                     onClick={() => {
                       // Dispatch custom event to open search
                       window.dispatchEvent(new CustomEvent('openSearch'));
                     }}
                     className="group inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white rounded-xl font-semibold text-sm border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-arabic"
                   >
                     <span>البحث</span>
                     <svg className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                   </button>
                 </div>
                 

               </div>
               
               {/* Enhanced Stats Panel */}
               <div className="lg:col-span-5">
                 <div className="bg-gradient-to-br from-white/10 via-white/20 to-white/10 backdrop-blur-3xl rounded-2xl p-4 border border-white/20 shadow-2xl shadow-black/30">
                   <div className="text-center mb-3">
                     <h3 className="text-sm font-bold text-white mb-1 font-heading">إحصائيات حية</h3>
                     <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
                   </div>
                   
                                        <div className="grid grid-cols-2 gap-3">
                       <div className="group relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/30 hover:border-blue-400/60 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                         <div className="relative text-center">
                           <div className="text-xl font-black bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-100 bg-clip-text text-transparent mb-1 drop-shadow-sm">750+</div>
                           <div className="text-xs font-bold text-blue-200 font-arabic">مقال يومياً</div>
                         </div>
                       </div>
                       
                       <div className="group relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/30 hover:border-indigo-400/60 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-blue-500/10 to-indigo-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                         <div className="relative text-center">
                           <div className="text-xl font-black bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-100 bg-clip-text text-transparent mb-1 drop-shadow-sm">500K+</div>
                           <div className="text-xs font-bold text-blue-200 font-arabic">قارئ شهرياً</div>
                         </div>
                       </div>
                       
                       <div className="group relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/30 hover:border-blue-300/60 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                         <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 via-blue-500/10 to-blue-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                         <div className="relative text-center">
                           <div className="text-xl font-black bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-100 bg-clip-text text-transparent mb-1 drop-shadow-sm">24/7</div>
                           <div className="text-xs font-bold text-blue-200 font-arabic">تغطية مباشرة</div>
                         </div>
                       </div>
                       
                       <div className="group relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/30 hover:border-indigo-300/60 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                         <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/15 via-indigo-500/10 to-indigo-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                         <div className="relative text-center">
                           <div className="text-xl font-black bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-100 bg-clip-text text-transparent mb-1 drop-shadow-sm">15</div>
                           <div className="text-xs font-bold text-blue-200 font-arabic">قسم إخباري</div>
                         </div>
                       </div>
                     </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
        
                 {/* Spectacular Bottom Effect */}
         <div className="absolute bottom-0 left-0 right-0">
           <div className="h-2 bg-gradient-to-r from-blue-500/70 via-indigo-500/80 via-blue-600/70 to-blue-500/70 bg-[length:200%_100%] animate-pulse"></div>
           <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
           <div className="h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
         </div>
        
        
      </section>
      
      {/* Compact Enhanced Featured Articles Section */}
      <section id="featured-articles-section" className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-6 -mt-1 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-8 right-8 w-48 h-48 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-8 left-8 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative">
          {/* Compact Enhanced Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-primary/10 mb-3">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 animate-pulse"></span>
              <span className="text-primary font-semibold text-xs font-heading">مختارات المحررين</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-heading">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                الأخبار المميزة
              </span>
            </h2>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-primary via-pink-500 to-secondary rounded-full"></div>
              <div className="w-6 h-0.5 bg-gradient-to-l from-transparent to-secondary rounded-full"></div>
            </div>
            <p className="text-gray-600 max-w-md mx-auto text-center font-arabic text-sm">أهم القصص التي تشكل عالمنا اليوم</p>
          </div>
          
                     {/* Compact Featured Articles Grid */}
           {mainFeatured && (
             <div className="grid md:grid-cols-12 gap-6">
               {/* Compact Main Featured Article - 8 columns */}
               <div className="md:col-span-8">
                 <article className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
                   {/* Compact Image Container */}
                   <Link href={`/article/${mainFeatured.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                     <Image
                       {...getSafeImageProps(
                         mainFeatured.image?.url || '',
                         mainFeatured.image?.alt || mainFeatured.title,
                         mainFeatured.category?.name
                       )}
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                     {/* Compact Overlay Effects */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     
                     {/* Compact Breaking News Badge */}
                     <div className="absolute top-3 right-3">
                       <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                         <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                         <span className="font-heading">عاجل</span>
                       </div>
                     </div>
                   </Link>
                   
                   {/* Compact Content */}
                   <div className="p-6">
                     {/* Compact Meta Information */}
                     <div className="flex items-center gap-3 mb-4">
                       <CategoryBadge category={mainFeatured.category} />
                       <div className="flex items-center gap-1.5 text-gray-500 text-sm font-arabic">
                         <FiClock className="w-3.5 h-3.5" />
                         <span>{mainFeatured.timeAgo}</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                         <FiEye className="w-3.5 h-3.5" />
                         <span className="font-mono">{getRandomInt(50000, 250000).toLocaleString()}</span>
                       </div>
                     </div>
                     
                     {/* Compact Title */}
                     <Link href={`/article/${mainFeatured.slug}`}>
                       <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 font-heading leading-tight">
                         {mainFeatured.title}
                       </h3>
                     </Link>
                     
                     {/* Compact Excerpt */}
                     <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed font-arabic">
                       {mainFeatured.excerpt}
                     </p>
                     
                     {/* Compact Author & CTA Section */}
                     <div className="flex items-center justify-between">
                       {/* Compact Author Info */}
                       <div className="flex items-center gap-3">
                         <div className="relative">
                           <div className="w-10 h-10 bg-gradient-to-br from-primary via-pink-500 to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                             DN
                           </div>
                           <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white flex items-center justify-center">
                             <div className="w-1 h-1 bg-white rounded-full"></div>
                           </div>
                         </div>
                         <div>
                           <span className="text-gray-900 font-semibold font-arabic block text-sm ml-3">DeepNews</span>
                           <p className="text-gray-500 text-xs font-arabic">محرر أول</p>
                         </div>
                       </div>
                       
                       {/* Compact CTA Button */}
                       <Link 
                         href={`/article/${mainFeatured.slug}`}
                         className="group/cta inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-md hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 font-arabic text-sm"
                       >
                         <span>اقرأ المزيد</span>
                         <FiChevronRight className="mr-1.5 w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
                       </Link>
                     </div>
                   </div>
                 </article>
               </div>
              
                             {/* Compact Side Featured Articles - 4 columns */}
               <div className="md:col-span-4">
                 <div className="sticky top-8">
                   <div className="bg-gradient-to-br from-white/90 via-white/70 to-white/90 backdrop-blur-xl p-4 rounded-2xl border border-white/30 shadow-lg">
                     {/* Compact Sidebar Header */}
                     <div className="flex items-center gap-2.5 mb-4">
                       <div className="p-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                         <FiTrendingUp className="w-4 h-4 text-primary" />
                       </div>
                       <div>
                         <h4 className="text-base font-bold text-gray-900 font-heading">الأكثر قراءة</h4>
                         <p className="text-xs text-gray-500 font-arabic">خلال الساعات الماضية</p>
                       </div>
                     </div>
                     
                     {/* Compact Trending Articles */}
                     <div className="space-y-4">
                       {sideFeatured.map((article, index) => (
                         <article key={article.id} className="group">
                           <div className="flex gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-primary/10">
                             {/* Compact Article Number */}
                             <div className="flex-shrink-0">
                               <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-secondary text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform duration-300">
                                 {index + 1}
                                 <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                 <span className="relative">{index + 1}</span>
                               </div>
                             </div>
                             
                             {/* Compact Content */}
                             <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-1.5 mb-1.5">
                                 <CategoryBadge category={article.category} size="sm" />
                                 <span className="text-gray-400 text-xs">•</span>
                                 <span className="text-gray-500 text-xs font-arabic">{article.timeAgo}</span>
                               </div>
                               
                               <Link href={`/article/${article.slug}`}>
                                 <h5 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2 font-heading leading-snug text-sm">
                                   {article.title}
                                 </h5>
                               </Link>
                               
                               <div className="flex items-center justify-between text-xs text-gray-500">
                                 <div className="flex items-center gap-1">
                                   <FiEye className="w-3 h-3" />
                                   <span className="font-mono">{getRandomInt(50000, 250000).toLocaleString()}</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                   <FiClock className="w-3 h-3" />
                                   <span className="font-arabic">{article.readTime}د</span>
                                 </div>
                               </div>
                             </div>
                             
                             {/* Compact Thumbnail */}
                             <div className="flex-shrink-0">
                               <Link href={`/article/${article.slug}`} className="block relative w-14 h-14 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                                 <Image
                                   {...getSafeImageProps(
                                     article.image?.url || '',
                                     article.image?.alt || article.title,
                                     article.category?.name
                                   )}
                                   fill
                                   className="object-cover group-hover:scale-110 transition-transform duration-300"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                               </Link>
                             </div>
                           </div>
                           
                           {/* Compact Divider */}
                           {index < sideFeatured.length - 1 && (
                             <div className="my-3">
                               <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                             </div>
                           )}
                         </article>
                       ))}
                     </div>
                     
                     {/* Compact View All Link */}
                     <div className="mt-4 pt-3 border-t border-gray-200">
                       <Link 
                         href="/articles" 
                         className="group flex items-center justify-center gap-2 text-primary font-semibold hover:text-secondary transition-colors duration-300 font-arabic text-sm"
                       >
                         <span>عرض جميع الأخبار</span>
                         <FiChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                       </Link>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mb-16 pt-8">
          <SectionHeader 
            title="تصفح التصنيفات" 
            viewAllLink="/categories"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-transparent"
              >
                {/* Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-pink-500/10 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="absolute inset-[1px] bg-white rounded-xl"></div>
                
                {/* Content */}
                <div className="relative p-5 text-center">
                  {/* Category Icon */}
                  <div className="mb-3">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300">
                      <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(category.icon)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors font-heading mb-1">
                    {category.name}
                  </h3>
                  
                  {/* Category Description */}
                  <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors font-arabic line-clamp-2">
                    {category.description}
                  </p>
                  
                  {/* Accent Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-pink-500 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* World News Section */}
      <section className="container mb-10">
        <SectionHeader 
          title="عالم" 
          viewAllLink="/category/world"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {worldArticles.slice(0, 8).map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
            />
          ))}
        </div>
      </section>

      {/* Politics Section */}
      <section className="container mb-10">
        <SectionHeader 
          title="سياسة" 
          viewAllLink="/category/politics"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured Article - Takes 8 columns */}
          {politicsArticles.slice(0, 1).map((article) => (
            <div key={article.id} className="lg:col-span-8">
              <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Link href={`/article/${article.slug}`} className="block h-full">
                    <Image
                      {...getSafeImageProps(
                        article.image?.url || '',
                        article.image?.alt || article.title,
                        article.category?.name
                      )}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </Link>
                  <div className="absolute top-6 left-6">
                    <CategoryBadge category={article.category} />
                  </div>
                  <div className="absolute top-6 right-6">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      🔥 Must Read
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-gray-500 text-sm font-arabic">📅 {article.timeAgo}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm font-arabic">⏱️ {article.readTime} min read</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">👁️ {getRandomInt(50000, 250000).toLocaleString()} views</span>
                  </div>
                  
                  <Link href={`/article/${article.slug}`}>
                    <h3 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900 hover:text-primary transition-colors line-clamp-2 group-hover:text-primary font-heading">
                      {article.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed font-arabic">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        DN
                      </div>
                      <div>
                        <span className="text-gray-900 font-semibold font-arabic">DeepNews</span>
                        <p className="text-gray-500 text-sm font-arabic">محرر أول</p>
                      </div>
                    </div>
                    <Link 
                      href={`/article/${article.slug}`}
                      className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group font-arabic"
                    >
                      اقرأ المزيد 
                      <FiChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Side Articles - Takes 4 columns */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl">
              <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center font-heading">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span className="font-arabic">القصص الشائعة</span>
              </h4>
              
              <div className="space-y-3">
                {politicsArticles.slice(1, 4).map((article, index) => (
                  <article key={article.id} className="group">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 2}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <CategoryBadge category={article.category} size="sm" />
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-gray-500 text-xs font-arabic">{article.timeAgo}</span>
                        </div>
                        
                        <Link href={`/article/${article.slug}`}>
                          <h5 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2 font-heading">
                            {article.title}
                          </h5>
                        </Link>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3 font-arabic">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>👁️ {getRandomInt(50000, 250000).toLocaleString()} views</span>
                          <span className="font-arabic">⏱️ {article.readTime}م قراءة</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Link href={`/article/${article.slug}`} className="block relative w-20 h-20 rounded-lg overflow-hidden">
                          <Image
                            {...getSafeImageProps(
                              article.image?.url || '',
                              article.image?.alt || article.title,
                              article.category?.name
                            )}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                    </div>
                    
                    {index < 2 && (
                      <hr className="my-4 border-gray-200" />
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="container mb-16">
        <SectionHeader 
          title="اقتصاد" 
          viewAllLink="/category/business"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Sports Section */}
      {sportsArticles.length > 0 && (
        <section className="container mb-16">
          <SectionHeader 
            title="رياضة" 
            viewAllLink="/category/sports"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportsArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Entertainment Section */}
      {entertainmentArticles.length > 0 && (
        <section className="container mb-16">
          <SectionHeader 
            title="فن" 
            viewAllLink="/category/entertainment"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {entertainmentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Subscription */}
      <section className="bg-gradient-to-r from-primary to-secondary py-12 mb-16">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-heading">
            اشترك في النشرة الإخبارية
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto font-arabic">
            احصل على آخر الأخبار مباشرة في بريدك الإلكتروني
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white/50 font-arabic"
            />
            <button className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors font-arabic">
              اشتراك
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">150K+</div>
            <div className="text-gray-600 font-arabic">مقال منشور</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">{categories.length}</div>
            <div className="text-gray-600 font-arabic">تصنيف</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2.8M+</div>
            <div className="text-gray-600 font-arabic">إجمالي المشاهدات</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-600 font-arabic">تغطية إخبارية</div>
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
    technology: '💻', 
    trophy: '🏆',
    sports: '🏆',
    building: '🏛️',
    politics: '🏛️',
    briefcase: '💼',
    business: '💼',
    film: '🎬',
    entertainment: '🎬',
    heart: '❤️',
    health: '🏥',
    world: '🌍',
    science: '🔬',
    lifestyle: '🌟',
    food: '🍽️',
    travel: '✈️',
    default: '📰',
  };
  
  return icons[iconName.toLowerCase()] || icons.default;
} 