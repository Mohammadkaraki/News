"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiMenu, FiX, FiBell, FiBookmark, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import SearchBar from './SearchBar';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleOpenSearch = () => {
      setIsSearchOpen(true);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('openSearch', handleOpenSearch);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openSearch', handleOpenSearch);
    };
  }, []);

  // Fixed navigation items in the specified order
  const navItems = [
    { name: 'عالم', slug: 'world', href: '/category/world' },
    { name: 'سياسة', slug: 'politics', href: '/category/politics' },
    { name: 'اقتصاد', slug: 'business', href: '/category/business' },
    { name: 'رياضة', slug: 'sports', href: '/category/sports' },
    { name: 'فن', slug: 'entertainment', href: '/category/entertainment' },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-white'} border-b border-gray-100 transition-all duration-300`}>
      <div className="container py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Left Navigation */}
          <div className="flex items-center space-x-20">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                {/* Logo Container with Background */}
                <div className="relative bg-gradient-to-br from-primary via-blue-600 to-secondary p-0.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-2">
                    {/* Logo Icon */}
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary via-blue-600 to-secondary rounded-lg flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      {/* Pulse Animation */}
                      <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg animate-pulse"></div>
                    </div>
                    
                    {/* Logo Text */}
                    <div className="flex flex-col">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent leading-tight">
                        DeepNews
                      </h1>
                      <div className="h-0.5 bg-gradient-to-r from-primary via-blue-600 to-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-600/20 to-secondary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </Link>
            
            <div className="hidden md:flex md:pr-8 items-center space-x-6 space-x-reverse">
           
              {navItems.map((item) => (
                <Link 
                  key={item.slug}
                  href={item.href}
                  className="text-base font-bold text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
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
                  className="text-base font-bold text-gray-700 hover:text-primary transition-colors duration-200"
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
                className="px-2 py-2 text-base font-bold text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                الأحدث
              </Link>
              {navItems.map((item) => (
                <Link 
                  key={item.slug}
                  href={item.href}
                  className="px-2 py-2 text-base font-bold text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
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
                    الملف الشخصي
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="px-2 py-2 text-base font-bold text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-2 py-2 text-base font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ابدأ الآن
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