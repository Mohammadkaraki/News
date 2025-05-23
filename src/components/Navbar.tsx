"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiMenu, FiX, FiBell, FiBookmark } from 'react-icons/fi';
import SearchBar from './SearchBar';

const categories = [
  { name: 'Stories', href: '/category/stories' },
  { name: 'Creator', href: '/category/creator' },
  { name: 'Community', href: '/category/community' }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-white'} border-b border-gray-100 transition-all duration-300`}>
      <div className="container py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary">
                <span className="bg-primary text-white px-2 py-1 rounded-md mr-1">B</span>
                uletin
              </h1>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                <Link 
                  key={category.name}
                  href={category.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
              aria-label="Saved"
            >
              <FiBookmark className="w-5 h-5" />
            </button>
            <Link href="/subscribe" className="btn">
              Subscribe
            </Link>
            <Link 
              href="/write" 
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Write
            </Link>
            <button className="flex items-center ml-2">
              <div className="w-8 h-8 rounded-full overflow-hidden relative border-2 border-gray-100">
                <Image 
                  src="/avatar-placeholder.jpg" 
                  alt="User profile" 
                  fill
                  className="object-cover"
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link 
                  key={category.name}
                  href={category.href}
                  className="px-2 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                >
                  {category.name}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              <div className="flex items-center space-x-3 py-2">
                <button className="p-2 text-gray-500 hover:text-primary" aria-label="Notifications">
                  <FiBell className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-primary" aria-label="Saved">
                  <FiBookmark className="w-5 h-5" />
                </button>
              </div>
              <Link 
                href="/subscribe" 
                className="px-3 py-2 text-base font-medium bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Subscribe
              </Link>
              <Link 
                href="/write" 
                className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-lg transition-colors duration-200"
              >
                Write
              </Link>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 pb-4 animate-slideDown">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  );
} 