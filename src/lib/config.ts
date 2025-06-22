// App Configuration
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // App Settings
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'موقع الأخبار',
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'موقع أخبار حديث مع محتوى في الوقت الفعلي',
  
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
    defaultTitle: 'موقع الأخبار - آخر الأخبار والتحديثات',
    defaultDescription: 'ابق على اطلاع بآخر الأخبار في التكنولوجيا والرياضة والسياسة والأعمال والترفيه والصحة.',
    defaultKeywords: ['أخبار', 'آخر الأخبار', 'أخبار عاجلة', 'تكنولوجيا', 'رياضة', 'سياسة'],
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