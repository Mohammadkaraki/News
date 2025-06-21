// App Configuration
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // App Settings
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'News Website',
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Modern news website with real-time content',
  
  // Pagination
  defaultPageSize: 10,
  maxPageSize: 50,
  
  // Cache settings
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  
  // Search settings
  searchDebounceMs: 300,
  minSearchLength: 2,
  
  // UI Settings
  featuredArticlesCount: 6,
  relatedArticlesCount: 3,
  
  // Social sharing
  socialPlatforms: {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    twitter: 'https://twitter.com/intent/tweet?url=',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=',
    whatsapp: 'https://wa.me/?text=',
  },
  
  // SEO defaults
  seo: {
    defaultTitle: 'News Website - Latest News and Updates',
    defaultDescription: 'Stay updated with the latest news across technology, sports, politics, business, entertainment, and health.',
    defaultKeywords: ['news', 'latest news', 'breaking news', 'technology', 'sports', 'politics'],
    twitterHandle: '@newswebsite',
    ogImage: '/og-image.jpg',
  },
  
  // Theme settings
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
  },
};

export default config; 