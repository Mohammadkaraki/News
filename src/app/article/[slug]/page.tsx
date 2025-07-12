'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiClock, FiShare2, FiBookmark, FiMessageCircle, FiEye, FiLoader, FiTag, FiUser, FiCalendar } from 'react-icons/fi';

import CategoryBadge from '@/components/CategoryBadge';
import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';
import { articleApi } from '@/lib/api';
import { getSafeAuthorInfo, getSafeImageProps } from '@/lib/imageUtils';
import type { Article } from '@/types/api';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Helper for random large numbers
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the article by slug
        const response = await articleApi.getArticleBySlug(slug);
        
        if (response.success && response.data?.article) {
          setArticle(response.data.article);
          
          // Fetch related articles from the same category
          const relatedResponse = await articleApi.getArticles({ 
            category: response.data.article.category.slug,
            limit: 4 
          });
          
          if (relatedResponse.success && relatedResponse.data?.articles) {
            // Filter out the current article from related articles
            const filtered = relatedResponse.data.articles.filter(
              (a) => a.id !== response.data!.article.id
            );
            setRelatedArticles(filtered.slice(0, 3));
          }
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600 text-lg">جاري تحميل المقال...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Enhanced Hero Section with Modern Design */}
      <div className="relative bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 text-white overflow-hidden min-h-[32vh] flex flex-col justify-end pb-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        <div className="relative container py-8 md:py-12 flex flex-col justify-end">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Breadcrumb */}
            <nav className="flex items-center space-x-3 text-xs mb-4 opacity-90 font-cairo">
              <Link href="/" className="hover:text-blue-300 transition-colors duration-300 flex items-center">
                <span className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">الرئيسية</span>
              </Link>
              <span className="text-blue-300">/</span>
              <Link href={`/category/${article.category.slug}`} className="hover:text-blue-300 transition-colors duration-300">
                <span className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">{article.category.name}</span>
              </Link>
              <span className="text-blue-300">/</span>
              <span className="text-gray-300 truncate bg-white/5 backdrop-blur-sm px-2 py-1 rounded-full">{article.title}</span>
            </nav>

            {/* Enhanced Category Badge */}
            <div className="mb-4">
              <div className="inline-flex items-center px-3 py-1.5 bg-white/15 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-blue-100 font-cairo font-semibold text-sm">{article.category.name}</span>
              </div>
            </div>
            
            {/* Enhanced Article Title */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-3 text-white font-cairo drop-shadow-lg line-clamp-2">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {article.title}
              </span>
            </h1>
            
            {/* Enhanced Article Excerpt */}
            <p className="text-sm md:text-base text-blue-100 mb-4 leading-relaxed max-w-3xl font-cairo line-clamp-2">
              {article.excerpt}
            </p>
            
            {/* Enhanced Author and Meta Info */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-base mr-3 shadow-xl border-2 border-white/20">
                    DN
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="ml-2">
                  <p className="font-bold text-base text-white font-cairo">DeepNews</p>
                  <div className="flex flex-row-reverse items-center text-blue-200 text-xs space-x-2 mt-0.5 font-cairo">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                      <FiCalendar className="ml-1 w-2.5 h-2.5" />
                      <span dir="ltr">{(() => {
                        if (typeof article.timeAgo === 'string' && /\d$/.test(article.timeAgo)) {
                          const parts = article.timeAgo.split(' ');
                          if (!isNaN(Number(parts[parts.length - 1]))) {
                            const num = parts.pop();
                            return num + ' ' + parts.join(' ');
                          }
                        }
                        return article.timeAgo;
                      })()}</span>
                    </div>
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                      <FiClock className="mr-1 w-2.5 h-2.5" />
                      <span>{article.readTime}د</span>
                    </div>
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                      <FiEye className="mr-1 w-2.5 h-2.5" />
                      <span>{getRandomInt(50000, 250000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Action Buttons */}
              <div className="flex gap-x-2">
                <button 
                  className="p-2 rounded-md bg-white/15 hover:bg-white/25 transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl" 
                  aria-label="مشاركة المقال"
                >
                  <FiShare2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  className="p-2 rounded-md bg-white/15 hover:bg-white/25 transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl" 
                  aria-label="حفظ المقال"
                >
                  <FiBookmark className="w-3.5 h-3.5" />
                </button>
                <button 
                  className="p-2 rounded-md bg-white/15 hover:bg-white/25 transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl" 
                  aria-label="التعليق على المقال"
                >
                  <FiMessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container -mt-8 md:-mt-10 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              {...getSafeImageProps(
                article.image?.url || '',
                article.image?.alt || article.title,
                article.category?.name
              )}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div 
                className="prose prose-base max-w-none arabic-text font-cairo
                  prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:leading-snug
                  prose-h1:text-xl prose-h1:mb-4 prose-h1:mt-6 prose-h1:text-primary
                  prose-h2:text-lg prose-h2:mb-3 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:text-gray-800
                  prose-h3:text-base prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-gray-800
                  prose-h4:text-sm prose-h4:mb-2 prose-h4:mt-3 prose-h4:text-gray-700 prose-h4:font-medium
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base prose-p:font-normal
                  prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80 hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:my-4 prose-ol:my-4 prose-ul:mr-6 prose-ol:mr-6
                  prose-li:my-1 prose-li:text-gray-700 prose-li:text-base
                  prose-blockquote:border-r-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 
                  prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-600
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-gray-800
                  prose-pre:bg-gray-900 prose-pre:text-white prose-pre:rounded-lg prose-pre:p-4 prose-pre:text-sm
                  prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              {/* Article Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                                  <div className="flex items-center mb-4">
                  <FiTag className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-semibold font-cairo">العلامات:</span>
                </div>
                  <div className="flex flex-wrap gap-3">
                    {article.tags.map((tag) => (
                      <Link 
                        key={tag}
                        href={`/tag/${tag}`} 
                        className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full text-sm font-medium text-gray-700 hover:from-primary/10 hover:to-primary/5 hover:text-primary transition-all duration-200 border border-gray-200 hover:border-primary/20"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Share Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center font-cairo">
                    <FiShare2 className="w-5 h-5 mr-2 text-primary" />
                    مشاركة المقال
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      فيسبوك
                    </button>
                    <button className="w-full flex items-center justify-center py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </button>
                    <button className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      واتساب
                    </button>
                  </div>
                </div>

                {/* Article Stats */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 font-cairo">إحصائيات المقال</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">المشاهدات</span>
                      <span className="font-semibold text-primary">{getRandomInt(50000, 250000).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">وقت القراءة</span>
                      <span className="font-semibold text-primary">{article.readTime} دقائق</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">التصنيف</span>
                      <span className="font-semibold text-primary">{article.category.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                DN
              </div>
              <div className="flex-1">
                                  <div className="flex items-center mb-3">
                    <FiUser className="w-5 h-5 text-primary mr-2" />
                    <h3 className="font-bold text-xl text-gray-900 font-cairo">عن الكاتب: DeepNews</h3>
                  </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {article.author?.bio || 'كاتب وصحفي متمرس يغطي أحدث الأخبار والاتجاهات في مجال تخصصه.'}
                </p>
                <Link 
                  href={`/author/${getSafeAuthorInfo(article.author).name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  عرض جميع المقالات
                  <span className="mr-2">←</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <SectionHeader 
                title="مقالات ذات صلة" 
                viewAllLink={`/category/${article.category.slug}`}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard 
                    key={relatedArticle.id} 
                    article={relatedArticle} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
} 