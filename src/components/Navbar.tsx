"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiMenu, FiX, FiBell, FiBookmark, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import SearchBar from './SearchBar';
import { useAuth } from '@/context/AuthContext';
import { categoryApi } from '@/lib/api';
import type { Category } from '@/types/api';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch categories for navigation
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        if (response.success && response.data) {
          setCategories(response.data.categories.slice(0, 6)); // Show first 6 categories
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-white'} border-b border-gray-100 transition-all duration-300`}>
      <div className="container py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary">
                <span className="bg-primary text-white px-2 py-1 rounded-md ml-1">أ</span>
                خبار
              </h1>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6 space-x-reverse">
              <Link 
                href="/articles"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
              >
                الأحدث
              </Link>
              {categories.slice(0, 4).map((category) => (
                <Link 
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  {category.name}
                </Link>
              ))}
              <Link 
                href="/categories"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
              >
                المزيد
              </Link>
            </div>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
              aria-label="بحث"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <>
                <button 
                  className="p-2 text-gray-500 hover:text-primary transition-colors duration-200 relative"
                  aria-label="الإشعارات"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <button 
                  className="p-2 text-gray-500 hover:text-primary transition-colors duration-200"
                  aria-label="المحفوظات"
                >
                  <FiBookmark className="w-5 h-5" />
                </button>
                
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.initials || user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link 
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4 ml-2" />
                        الملف الشخصي
                      </Link>
                      <Link 
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4 ml-2" />
                        الإعدادات
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="w-4 h-4 ml-2" />
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link 
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary text-sm"
                >
                  ابدأ الآن
                </Link>
              </div>
            )}
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
              <Link 
                href="/articles"
                className="px-2 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Latest News
              </Link>
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="px-2 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link 
                href="/categories"
                className="px-2 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                All Categories
              </Link>
              
              <hr className="my-2 border-gray-100" />
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-2 py-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.initials || user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link 
                    href="/profile"
                    className="px-2 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="px-2 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-2 py-2 text-base font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
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