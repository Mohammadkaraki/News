import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FiClock } from 'react-icons/fi';
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
}

export default function ArticleCard({ 
  article, 
  size = 'medium',
  hideExcerpt = false
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
  
  return (
    <article className="card group h-full flex flex-col">
      <Link href={`/article/${slug}`} className="relative block overflow-hidden">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center space-x-2 mb-2">
          <CategoryBadge category={category} />
          <span className="text-gray-500 text-xs">
            • {formatDistanceToNow(publishedAt, { addSuffix: true })}
          </span>
        </div>
        
        <Link href={`/article/${slug}`} className="block mb-2">
          <h3 className={`font-bold leading-tight ${size === 'large' ? 'text-2xl' : 'text-lg'}`}>
            {title}
          </h3>
        </Link>
        
        {!hideExcerpt && excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{excerpt}</p>
        )}
        
        <div className="mt-auto flex items-center justify-between">
          {author && (
            <div className="flex items-center">
              {author.imageUrl && (
                <Image
                  src={author.imageUrl}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
              )}
              <span className="text-xs text-gray-700">{author.name}</span>
            </div>
          )}
          
          {readTime && (
            <div className="flex items-center text-gray-500 text-xs">
              <FiClock className="w-3 h-3 mr-1" />
              <span>{readTime} min read</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
} 