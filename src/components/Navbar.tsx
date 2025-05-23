"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import SearchBar from './SearchBar';

const categories = [
  { name: 'Stories', href: '/category/stories' },
  { name: 'Creator', href: '/category/creator' },
  { name: 'Community', href: '/category/community' }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Buletin</h1>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {categories.map((category) => (
                <Link 
                  key={category.name}
                  href={category.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-primary"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <Link href="/subscribe" className="btn">
              Subscribe
            </Link>
            <Link href="/write" className="text-gray-700 hover:text-primary">
              Write
            </Link>
            <button className="flex items-center text-sm font-medium text-gray-700">
              <Image 
                src="/avatar-placeholder.jpg" 
                alt="User profile" 
                width={32} 
                height={32} 
                className="rounded-full"
              />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-primary"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-primary"
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
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link 
                  key={category.name}
                  href={category.href}
                  className="px-2 py-1 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md"
                >
                  {category.name}
                </Link>
              ))}
              <hr className="my-2 border-gray-200" />
              <Link 
                href="/subscribe" 
                className="px-2 py-1 text-base font-medium text-primary hover:bg-gray-100 rounded-md"
              >
                Subscribe
              </Link>
              <Link 
                href="/write" 
                className="px-2 py-1 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md"
              >
                Write
              </Link>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 pb-4">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  );
} 