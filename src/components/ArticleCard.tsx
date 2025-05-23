import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FiClock, FiBookmark } from 'react-icons/fi';
import CategoryBadge from './CategoryBadge';

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    imageUrl: string;
    category: {
      name: string;
      slug: string;
    };
    author?: {
      name: string;
      imageUrl?: string;
    };
    publishedAt: Date;
    readTime?: number;
  };
  size?: 'small' | 'medium' | 'large';
  hideExcerpt?: boolean;
  featured?: boolean;
}

export default function ArticleCard({ 
  article, 
  size = 'medium',
  hideExcerpt = false,
  featured = false
}: ArticleCardProps) {
  const {
    slug,
    title,
    excerpt,
    imageUrl,
    category,
    author,
    publishedAt,
    readTime
  } = article;

  const imageSizes = {
    small: { width: 400, height: 240 },
    medium: { width: 600, height: 340 },
    large: { width: 800, height: 450 },
  };
  
  const { width, height } = imageSizes[size];
  
  if (featured) {
    return (
      <article className="card group h-full flex flex-col overflow-hidden">
        <Link href={`/article/${slug}`} className="relative block aspect-video">
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 gradient-overlay z-10"></div>
          </div>
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
            <CategoryBadge category={category} featured={true} />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-white leading-tight text-balance drop-shadow-sm">
              {title}
            </h2>
            {!hideExcerpt && excerpt && (
              <p className="text-white/90 text-base md:text-lg mb-4 line-clamp-2 drop-shadow-sm">{excerpt}</p>
            )}
            <div className="flex items-center justify-between">
              {author && (
                <div className="flex items-center">
                  {author.imageUrl && (
                    <Image
                      src={author.imageUrl}
                      alt={author.name}
                      width={32}
                      height={32}
                      className="rounded-full mr-2 border-2 border-white/30"
                    />
                  )}
                  <span className="text-sm text-white/90">{author.name}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                {readTime && (
                  <div className="flex items-center text-white/80 text-sm">
                    <FiClock className="w-4 h-4 mr-1" />
                    <span>{readTime} min read</span>
                  </div>
                )}
                <button className="text-white/80 hover:text-white" aria-label="Save article">
                  <FiBookmark className="w-4 h-4" />
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
      <Link href={`/article/${slug}`} className="relative block overflow-hidden">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center space-x-3 mb-3">
          <CategoryBadge category={category} />
          <span className="text-gray-500 text-xs">
            {formatDistanceToNow(publishedAt, { addSuffix: true })}
          </span>
        </div>
        
        <Link href={`/article/${slug}`} className="block mb-3 group-hover:text-primary-600 transition-colors duration-200">
          <h3 className={`font-bold leading-tight ${size === 'large' ? 'text-2xl' : 'text-lg'} text-balance`}>
            {title}
          </h3>
        </Link>
        
        {!hideExcerpt && excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{excerpt}</p>
        )}
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          {author && (
            <div className="flex items-center">
              {author.imageUrl && (
                <div className="relative w-8 h-8 mr-2">
                  <Image
                    src={author.imageUrl}
                    alt={author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <span className="text-xs font-medium text-gray-700">{author.name}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            {readTime && (
              <div className="flex items-center text-gray-500 text-xs">
                <FiClock className="w-3 h-3 mr-1" />
                <span>{readTime} min read</span>
              </div>
            )}
            <button className="text-gray-400 hover:text-primary-600 transition-colors" aria-label="Save article">
              <FiBookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
} 