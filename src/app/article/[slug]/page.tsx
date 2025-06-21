'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiClock, FiShare2, FiBookmark, FiMessageCircle, FiEye, FiLoader } from 'react-icons/fi';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    notFound();
  }

  return (
    <article className="pb-16">
      {/* Hero Section */}
      <div className="bg-gray-100">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <CategoryBadge category={article.category} />
              <span className="ml-2 text-gray-500 text-sm">
                • {article.timeAgo}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-700 mb-8">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {getSafeAuthorInfo(article.author).initials}
                </div>
                <div>
                  <p className="font-medium">{getSafeAuthorInfo(article.author).name}</p>
                  <div className="flex items-center text-gray-500 text-sm space-x-4">
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{article.readTime} min read</span>
                    </div>
                    <div className="flex items-center">
                      <FiEye className="mr-1" />
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors" 
                  aria-label="Share article"
                >
                  <FiShare2 />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors" 
                  aria-label="Bookmark article"
                >
                  <FiBookmark />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors" 
                  aria-label="Comment on article"
                >
                  <FiMessageCircle />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container my-10">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video relative rounded-xl overflow-hidden">
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
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose lg:prose-xl prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t flex flex-wrap gap-2">
              <span className="text-gray-700 font-medium">Tags:</span>
              {article.tags.map((tag) => (
                <Link 
                  key={tag}
                  href={`/tag/${tag}`} 
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          
          {/* Author Bio */}
          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                {getSafeAuthorInfo(article.author).initials}
              </div>
              <div>
                <h3 className="font-bold text-lg">About {getSafeAuthorInfo(article.author).name}</h3>
                <p className="text-gray-600 mt-1">
                  {article.author?.bio || 'Experienced writer and journalist covering the latest news and trends.'}
                </p>
                <Link 
                  href={`/author/${getSafeAuthorInfo(article.author).name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-primary font-medium text-sm mt-2 inline-block hover:text-primary/80 transition-colors"
                >
                  View all articles →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="container mt-16">
          <div className="max-w-6xl mx-auto">
            <SectionHeader 
              title="Related Articles" 
              viewAllLink={`/category/${article.category.slug}`}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard 
                  key={relatedArticle.id} 
                  article={relatedArticle} 
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
} 