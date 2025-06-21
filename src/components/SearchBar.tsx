"use client";

import { FormEvent, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX, FiTrendingUp, FiClock, FiLoader } from 'react-icons/fi';
import { articleApi } from '@/lib/api';
import type { Article } from '@/types/api';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      if (onClose) onClose();
    }
  };

  const handleSuggestionClick = (suggestion: Article) => {
    router.push(`/article/${suggestion.slug}`);
    if (onClose) onClose();
  };

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await articleApi.searchArticles(searchQuery, 1);
      
      if (response.success && response.data) {
        setSuggestions(response.data.articles.slice(0, 5)); // Show top 5 suggestions
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // 300ms delay
  };

  useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus();
    
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Mock recent and trending searches
  const recentSearches = ['Ukraine conflict', 'Tech layoffs', 'Climate change'];
  const trendingSearches = ['Elections 2024', 'AI developments', 'World Cup'];

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-primary transition-all duration-200 bg-white shadow-soft">
          <div className="pl-4 text-gray-400">
            <FiSearch className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search for news, topics, or keywords..."
            className="w-full py-3 pl-2 pr-12 text-gray-700 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="h-full px-5 py-3 bg-primary text-white font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {isFocused && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-soft border border-gray-100 p-4 animate-slideDown z-10 max-h-96 overflow-y-auto">
          {query && query.length >= 2 ? (
            <div className="space-y-3">
              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <FiLoader className="w-5 h-5 animate-spin text-primary mr-2" />
                  <span className="text-sm text-gray-500">Searching...</span>
                </div>
              )}

              {/* Search suggestions */}
              {!isLoading && suggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center">
                    <FiSearch className="mr-1 w-3 h-3" /> SUGGESTIONS
                  </h4>
                  <ul className="space-y-1">
                    {suggestions.map((article) => (
                      <li key={article.id}>
                        <button 
                          onClick={() => handleSuggestionClick(article)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                              {article.image?.url && (
                                <img 
                                  src={article.image.url.startsWith('http') ? article.image.url : `http://localhost:5000${article.image.url}`}
                                  alt={article.image.alt || article.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                {article.title}
                              </h5>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {article.excerpt}
                              </p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                  style={{ 
                                    backgroundColor: `${article.category.color}20`,
                                    color: article.category.color 
                                  }}
                                >
                                  {article.category.name}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">{article.timeAgo}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  {/* View all results */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(query)}`);
                        if (onClose) onClose();
                      }}
                      className="w-full text-center py-2 text-sm text-primary hover:text-primary-700 font-medium transition-colors"
                    >
                      View all results for "{query}"
                    </button>
                  </div>
                </div>
              )}

              {/* No results */}
              {!isLoading && suggestions.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-2">No suggestions found for "{query}"</p>
                  <button
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      if (onClose) onClose();
                    }}
                    className="text-sm text-primary hover:text-primary-700 font-medium transition-colors"
                  >
                    Search anyway
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Show recent and trending when no query */
            <div className="space-y-3">
              {recentSearches.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                    <FiClock className="mr-1 w-3 h-3" /> RECENT SEARCHES
                  </h4>
                  <ul className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <li key={index}>
                        <button 
                          onClick={() => {
                            setQuery(search);
                            inputRef.current?.focus();
                          }}
                          className="text-sm text-gray-700 hover:text-primary flex items-center w-full text-left py-1 px-2 rounded hover:bg-gray-50 transition-colors duration-200"
                        >
                          {search}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {trendingSearches.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                    <FiTrendingUp className="mr-1 w-3 h-3" /> TRENDING NOW
                  </h4>
                  <ul className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <li key={index}>
                        <button 
                          onClick={() => {
                            setQuery(search);
                            inputRef.current?.focus();
                          }}
                          className="text-sm text-gray-700 hover:text-primary flex items-center w-full text-left py-1 px-2 rounded hover:bg-gray-50 transition-colors duration-200"
                        >
                          {search}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 