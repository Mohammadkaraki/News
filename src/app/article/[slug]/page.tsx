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
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm mb-8 opacity-90">
              <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link href={`/category/${article.category.slug}`} className="hover:text-primary transition-colors">
                {article.category.name}
              </Link>
              <span>/</span>
              <span className="text-gray-300 truncate">{article.title}</span>
            </nav>

            {/* Category Badge */}
            <div className="mb-6">
              <CategoryBadge category={article.category} />
            </div>
            
            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-white">
              {article.title}
            </h1>
            
            {/* Article Excerpt */}
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>
            
            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                  {getSafeAuthorInfo(article.author).initials}
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">{getSafeAuthorInfo(article.author).name}</p>
                  <div className="flex items-center text-gray-300 text-sm space-x-6 mt-1">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      <span>{article.timeAgo}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-2" />
                      <span>{article.readTime} دقائق قراءة</span>
                    </div>
                    <div className="flex items-center">
                      <FiEye className="mr-2" />
                      <span>{article.views} مشاهدة</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm" 
                  aria-label="مشاركة المقال"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
                <button 
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm" 
                  aria-label="حفظ المقال"
                >
                  <FiBookmark className="w-5 h-5" />
                </button>
                <button 
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm" 
                  aria-label="التعليق على المقال"
                >
                  <FiMessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container -mt-16 relative z-10">
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
                className="prose prose-base max-w-none arabic-text
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
                    <span className="text-gray-700 font-semibold">العلامات:</span>
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
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <FiShare2 className="w-5 h-5 mr-2 text-primary" />
                    مشاركة المقال
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      فيسبوك
                    </button>
                    <button className="w-full flex items-center justify-center py-3 px-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                      تويتر
                    </button>
                    <button className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      واتساب
                    </button>
                  </div>
                </div>

                {/* Article Stats */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">إحصائيات المقال</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">المشاهدات</span>
                      <span className="font-semibold text-primary">{article.views}</span>
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
                {getSafeAuthorInfo(article.author).initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <FiUser className="w-5 h-5 text-primary mr-2" />
                  <h3 className="font-bold text-xl text-gray-900">عن الكاتب: {getSafeAuthorInfo(article.author).name}</h3>
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