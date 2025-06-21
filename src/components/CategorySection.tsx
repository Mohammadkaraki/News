import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from './ArticleCard';
import SectionHeader from './SectionHeader';
import { articleApi } from '@/lib/api';
import { getSafeAuthorInfo } from '@/lib/imageUtils';
import type { Article, Category } from '@/types/api';

interface CategorySectionProps {
  category: Category;
  limit?: number;
  layout?: 'grid' | 'list';
  className?: string;
}

export default function CategorySection({ 
  category, 
  limit = 4, 
  layout = 'grid',
  className = '' 
}: CategorySectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      try {
        setLoading(true);
        const response = await articleApi.getArticles({ 
          category: category.slug, 
          limit 
        });
        
        if (response.success && response.data) {
          setArticles(response.data.articles);
        }
      } catch (error) {
        console.error(`Error fetching ${category.name} articles:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [category.slug, limit]);

  if (loading) {
    return (
      <section className={`container mb-16 ${className}`}>
        <SectionHeader 
          title={category.name}
          viewAllLink={`/category/${category.slug}`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(limit).fill(null).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null; // Don't render empty sections
  }

  return (
    <section className={`container mb-16 ${className}`}>
      <SectionHeader 
        title={category.name}
        viewAllLink={`/category/${category.slug}`}
      />
      
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="flex gap-6 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="w-1/3 relative aspect-video">
                <Link href={`/article/${article.slug}`}>
                  <Image
                    src={article.image.url}
                    alt={article.image.alt}
                    fill
                    className="object-cover"
                  />
                </Link>
              </div>
              <div className="w-2/3 p-6">
                <Link href={`/article/${article.slug}`}>
                  <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{getSafeAuthorInfo(article.author).name}</span>
                  <span>{article.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
} 