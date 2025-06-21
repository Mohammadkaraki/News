'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import { articleApi } from '@/lib/api';
import type { Article } from '@/types/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || '1');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, page]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await articleApi.searchArticles(query, page);
      
      if (response.success && response.data) {
        setArticles(response.data.articles);
        setTotalResults(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Search error:', error);
      setArticles([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto mb-10">
        <div className="relative">
          <form className="relative">
            <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden focus-within:border-primary">
              <div className="pl-4 text-gray-500">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search for news, topics, or keywords..."
                className="w-full py-3 pl-2 pr-12 text-gray-700 focus:outline-none"
              />
              <button
                type="submit"
                className="h-full px-6 py-3 bg-primary text-white font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {query ? (
        <div>
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-gray-600">
              {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{query}"
            </p>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(9).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded"></div>
                </div>
              ))}
            </div>
          ) : totalResults > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              {/* Show pagination if there are multiple pages */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={`/search?q=${encodeURIComponent(query)}`}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">No results found</h2>
              <p className="text-gray-600 mb-8">
                We couldn't find any matches for "{query}". Try searching with different keywords.
              </p>
              <div className="max-w-md mx-auto">
                <ul className="text-left bg-gray-50 rounded-lg p-6">
                  <li className="mb-2">• Check for typos and spelling errors</li>
                  <li className="mb-2">• Try more general keywords</li>
                  <li className="mb-2">• Try different keywords</li>
                  <li>• Browse our categories instead</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Search for articles</h2>
          <p className="text-gray-600 mb-6">
            Enter keywords above to search for articles, news, and topics.
          </p>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-3">Popular searches:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <a href="/search?q=technology" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
                Technology
              </a>
              <a href="/search?q=politics" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
                Politics
              </a>
              <a href="/search?q=business" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
                Business
              </a>
              <a href="/search?q=entertainment" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
                Entertainment
              </a>
              <a href="/search?q=science" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
                Science
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 