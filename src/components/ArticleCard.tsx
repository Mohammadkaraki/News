'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiClock, FiBookmark, FiEye, FiHeart } from 'react-icons/fi';
import CategoryBadge from './CategoryBadge';
import { articleApi } from '@/lib/api';
import { getSafeImageProps } from '@/lib/imageUtils';
import type { Article } from '@/types/api';

interface ArticleCardProps {
  article: Article;
  size?: 'small' | 'medium' | 'large';
  hideExcerpt?: boolean;
  featured?: boolean;
  showStats?: boolean;
}

export default function ArticleCard({ 
  article, 
  size = 'medium',
  hideExcerpt = false,
  featured = false,
  showStats = true
}: ArticleCardProps) {
  const [likes, setLikes] = useState(article.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await articleApi.likeArticle(article.id);
      if (response.success && response.data) {
        setLikes(response.data.likes);
      }
    } catch (error) {
      console.error('Failed to like article:', error);
    } finally {
      setIsLiking(false);
    }
  };

  if (featured) {
    return (
      <article className="card group h-full flex flex-col overflow-hidden">
        <Link href={`/article/${article.slug}`} className="relative block aspect-video">
          <div className="absolute inset-0">
            <Image
              {...getSafeImageProps(
                article.image?.url || '',
                article.image?.alt || article.title,
                article.category?.name
              )}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 gradient-overlay z-10"></div>
          </div>
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
            <CategoryBadge category={article.category} featured={true} />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-white leading-tight text-balance drop-shadow-sm">
              {article.title}
            </h2>
            {!hideExcerpt && article.excerpt && (
              <p className="text-white/90 text-base md:text-lg mb-4 line-clamp-2 drop-shadow-sm">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2 border-2 border-white/30">
                  {article.author?.initials || 'U'}
                </div>
                <span className="text-sm text-white/90">{article.author?.name || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {showStats && (
                  <>
                    <div className="flex items-center text-white/80 text-sm">
                      <FiClock className="w-4 h-4 mr-1" />
                      <span>{article.readTime || 1} min</span>
                    </div>
                    <div className="flex items-center text-white/80 text-sm">
                      <FiEye className="w-4 h-4 mr-1" />
                      <span>{article.views || 0}</span>
                    </div>
                  </>
                )}
                <button 
                  onClick={handleLike}
                  className="text-white/80 hover:text-white flex items-center"
                  disabled={isLiking}
                  aria-label="Like article"
                >
                  <FiHeart className="w-4 h-4 mr-1" />
                  <span>{likes || 0}</span>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }
  
  return (
    <article className="card group h-full flex flex-col">
      <Link href={`/article/${article.slug}`} className="relative block overflow-hidden">
        <div className="aspect-video relative overflow-hidden">
          <Image
            {...getSafeImageProps(
              article.image?.url || '',
              article.image?.alt || article.title,
              article.category?.name
            )}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center space-x-3 mb-3">
          <CategoryBadge category={article.category} />
          <span className="text-gray-500 text-xs">
            {article.timeAgo || 'Recently'}
          </span>
        </div>
        
        <Link href={`/article/${article.slug}`} className="block mb-3 group-hover:text-primary transition-colors duration-200">
          <h3 className={`font-bold leading-tight ${size === 'large' ? 'text-2xl' : 'text-lg'} text-balance`}>
            {article.title}
          </h3>
        </Link>
        
        {!hideExcerpt && article.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
        )}
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
              {article.author?.initials || 'U'}
            </div>
            <span className="text-xs font-medium text-gray-700">{article.author?.name || 'Unknown Author'}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {showStats && (
              <>
                <div className="flex items-center text-gray-500 text-xs">
                  <FiClock className="w-3 h-3 mr-1" />
                  <span>{article.readTime || 1}m</span>
                </div>
                <div className="flex items-center text-gray-500 text-xs">
                  <FiEye className="w-3 h-3 mr-1" />
                  <span>{article.views || 0}</span>
                </div>
              </>
            )}
            <button 
              onClick={handleLike}
              className="text-gray-400 hover:text-red-500 transition-colors flex items-center text-xs"
              disabled={isLiking}
              aria-label="Like article"
            >
              <FiHeart className="w-3 h-3 mr-1" />
              <span>{likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
} 