"use client";

import { FormEvent, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX, FiTrendingUp, FiClock } from 'react-icons/fi';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus();
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
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            placeholder="Search for news, topics, or keywords..."
            className="w-full py-3 pl-2 pr-12 text-gray-700 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-16 text-gray-400 hover:text-gray-700 transition-colors duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="h-full px-5 py-3 bg-primary text-white font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {isFocused && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-soft border border-gray-100 p-4 animate-slideDown z-10">
          {!query && (
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