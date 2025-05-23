import Image from 'next/image';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

import ArticleCard from '@/components/ArticleCard';
import SectionHeader from '@/components/SectionHeader';
import CategoryBadge from '@/components/CategoryBadge';

import { 
  featuredArticles, 
  latestNews, 
  publishers, 
  editorsPicks,
  businessNews,
  sportsNews
} from '@/data/mockData';

export default function HomePage() {
  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="bg-gray-50 py-12 mb-12">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-gray-800 uppercase tracking-wider text-sm font-semibold mb-4">
              Welcome to Buletin
            </h2>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Craft narratives ✍️ that ignite <span className="text-primary">inspiration</span> 🌟,{' '}
              <span className="text-primary">knowledge</span> 📚, and <span className="text-primary">entertainment</span> 🎬
            </h1>
          </div>
          
          {/* Featured Article */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden shadow-md">
              <Link href={`/article/${featuredArticles[0].slug}`} className="block relative aspect-video">
                <Image
                  src={featuredArticles[0].imageUrl}
                  alt={featuredArticles[0].title}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="p-6 bg-white">
                <div className="flex items-center space-x-2 mb-3">
                  <CategoryBadge category={featuredArticles[0].category} />
                  <span className="text-gray-500 text-xs">• 12 mins ago</span>
                </div>
                <Link href={`/article/${featuredArticles[0].slug}`}>
                  <h3 className="text-xl font-bold mb-2">{featuredArticles[0].title}</h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{featuredArticles[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      <Image
                        src={featuredArticles[0].author?.imageUrl || '/placeholder-avatar.jpg'}
                        alt={featuredArticles[0].author?.name || 'Author'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-700">{featuredArticles[0].author?.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span>{featuredArticles[0].readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {featuredArticles.slice(1).map((article) => (
                <div key={article.id} className="flex bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="w-1/3 relative">
                    <Link href={`/article/${article.slug}`} className="block h-full">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CategoryBadge category={article.category} size="sm" />
                      <span className="text-gray-500 text-xs">• 12 mins ago</span>
                    </div>
                    <Link href={`/article/${article.slug}`}>
                      <h3 className="font-bold mb-2 line-clamp-2">{article.title}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.excerpt}</p>
                    <div className="text-xs text-gray-500">
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="container mb-16">
        <SectionHeader 
          title="Latest News" 
          viewAllLink="/category/latest"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              size="small"
            />
          ))}
        </div>
      </section>

      {/* Buletin Story Section */}
      <section className="container mb-16">
        <SectionHeader 
          title="Buletin Story" 
          viewAllLink="/publishers"
        />
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {publishers.map((publisher) => (
            <Link 
              key={publisher.slug}
              href={`/publisher/${publisher.slug}`}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 relative">
                <Image
                  src={publisher.logo || `/logos/${publisher.slug}.png`}
                  alt={publisher.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Must Read Section */}
      <section className="container mb-16">
        <SectionHeader 
          title="Must Read" 
          viewAllLink="/category/editors-pick"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editorsPicks.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              size="medium"
            />
          ))}
        </div>
      </section>

      {/* Editor's Pick Section */}
      <section className="bg-gray-50 py-12 mb-16">
        <div className="container">
          <SectionHeader 
            title="Editor's Pick" 
            viewAllLink="/category/editors-pick"
          />
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-md p-5">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative aspect-video md:aspect-auto">
                  <Image
                    src={editorsPicks[0].imageUrl}
                    alt={editorsPicks[0].title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-1/2 md:pl-8 pt-4 md:pt-0">
                  <div className="flex items-center space-x-2 mb-3">
                    <CategoryBadge category={editorsPicks[0].category} />
                    <span className="text-gray-500 text-xs">• 5 hours ago</span>
                  </div>
                  <Link href={`/article/${editorsPicks[0].slug}`}>
                    <h3 className="text-2xl font-bold mb-3">{editorsPicks[0].title}</h3>
                  </Link>
                  <p className="text-gray-600 mb-4">{editorsPicks[0].excerpt}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{editorsPicks[0].readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {editorsPicks.slice(1).map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                size="small"
                hideExcerpt
              />
            ))}
            
            {/* More link card */}
            <div className="card flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Want to read more?</h3>
              <p className="text-gray-600 text-sm mb-4">Check out all editor-picked articles</p>
              <Link 
                href="/category/editors-pick" 
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center group"
              >
                View all articles
                <FiChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="container mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <SectionHeader 
            title="Business"
            viewAllLink="/category/business"
          />
          
          <Link href="/category/business" className="flex items-center text-primary">
            <FiChevronRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessNews.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              size="medium"
            />
          ))}
        </div>
      </section>

      {/* Sports Section */}
      <section className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <SectionHeader 
            title="Sport News"
            viewAllLink="/category/sport"
          />
          
          <Link href="/category/sport" className="flex items-center text-primary">
            <FiChevronRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sportsNews.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              size="medium"
            />
          ))}
        </div>
      </section>
    </div>
  );
} 