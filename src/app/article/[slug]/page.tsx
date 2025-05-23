import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { FiClock, FiShare2, FiBookmark, FiMessageCircle } from 'react-icons/fi';

import CategoryBadge from '@/components/CategoryBadge';
import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';
import { articles } from '@/data/mockData';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;
  
  // Find the article by slug
  const article = articles.find((a) => a.slug === slug);
  
  // If article doesn't exist, return 404
  if (!article) {
    notFound();
  }
  
  // Get related articles (same category, excluding current article)
  const relatedArticles = articles
    .filter(
      (a) => a.category.slug === article.category.slug && a.id !== article.id
    )
    .slice(0, 3);
  
  return (
    <article className="pb-16">
      {/* Hero Section */}
      <div className="bg-gray-100">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <CategoryBadge category={article.category} />
              <span className="ml-2 text-gray-500 text-sm">
                • {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
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
                {article.author?.imageUrl && (
                  <Image
                    src={article.author.imageUrl}
                    alt={article.author.name}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                )}
                <div>
                  <p className="font-medium">{article.author?.name}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiClock className="mr-1" />
                    <span>{article.readTime} min read</span>
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
              src={article.imageUrl}
              alt={article.title}
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
          <div className="prose lg:prose-xl">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in tortor enim. Cras sodales nulla sit amet quam vulputate, a interdum tellus vestibulum. Praesent imperdiet justo in ligula scelerisque condimentum. Cras vestibulum, neque eu aliquam auctor, purus tellus vestibulum augue, ut dapibus ipsum lectus ac nisl.
            </p>
            <p>
              Mauris rutrum, quam quis rhoncus auctor, nulla sem tristique felis, a interdum metus magna at magna. Cras in enim non massa condimentum lobortis. Praesent consequat, mauris a faucibus efficitur, purus neque elementum justo, et pulvinar libero enim sit amet augue.
            </p>
            <p>
              Quisque posuere porta dui, sit amet laoreet justo. In sodales lectus nulla, ac ultricies ex facilisis vel. Phasellus placerat condimentum orci eget blandit. Cras convallis velit sit amet nisl maximus tincidunt.
            </p>
            <h2>Key Highlights</h2>
            <ul>
              <li>Ut vehicula enim eget justo molestie, vel mollis nulla tincidunt.</li>
              <li>Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.</li>
              <li>Suspendisse potenti. Donec vel enim vel magna maximus efficitur vitae at enim.</li>
              <li>Aliquam erat volutpat. Suspendisse potenti.</li>
            </ul>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
            </p>
            <blockquote>
              Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </blockquote>
            <p>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
            </p>
          </div>
          
          {/* Article Tags */}
          <div className="mt-12 pt-6 border-t flex flex-wrap gap-2">
            <span className="text-gray-700 font-medium">Tags:</span>
            <Link 
              href={`/category/${article.category.slug}`} 
              className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {article.category.name}
            </Link>
            <Link 
              href="/tag/trending" 
              className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Trending
            </Link>
            <Link 
              href="/tag/featured" 
              className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              Featured
            </Link>
          </div>
          
          {/* Author Bio */}
          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              {article.author?.imageUrl && (
                <Image
                  src={article.author.imageUrl}
                  alt={article.author.name}
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
              )}
              <div>
                <h3 className="font-bold text-lg">About {article.author?.name}</h3>
                <p className="text-gray-600 mt-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in tortor enim. Cras sodales nulla sit amet quam vulputate.
                </p>
                <Link 
                  href={`/author/${article.author?.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-primary font-medium text-sm mt-2 inline-block"
                >
                  View all articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Articles */}
      <div className="container mt-16">
        <SectionHeader 
          title="You might also like" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              size="medium"
            />
          ))}
        </div>
      </div>
    </article>
  );
} 