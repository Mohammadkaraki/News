// Core API Types
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'editor' | 'admin';
  avatar?: string | null;
  bio?: string;
  isVerified?: boolean;
  isActive?: boolean;
  lastLogin?: string;
  preferences?: string[];
  createdAt?: string;
  updatedAt?: string;
  initials?: string;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  colorInfo?: {
    hex: string;
    rgb: {
      r: number;
      g: number;
      b: number;
    };
    name: string;
  };
}

export interface Article {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: {
    url: string;
    alt: string;
    caption?: string;
  };
  category: Category;
  author: {
    id: string;
    _id?: string;
    name: string;
    email: string;
    avatar?: string | null;
    bio?: string;
    initials: string;
  };
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt?: string;
  readTime: number;
  views: number;
  likes: number;
  shares: number;
  sections?: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  analytics?: {
    socialShares?: {
      facebook: number;
      twitter: number;
      linkedin: number;
    };
    bounceRate?: number;
    avgTimeOnPage?: number;
  };
  moderation?: {
    isModerated: boolean;
    flags: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  formattedPublishDate?: string;
  timeAgo?: string;
  wordCount?: number;
  isPublished?: string;
  url?: string;
}

// API Response wrapper types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  status?: number;
  errorId?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// Specific API response types
export interface ArticlesResponse {
  articles: Article[];
  pagination: PaginationInfo;
  filters?: any;
}

export interface ArticleResponse {
  article: Article;
  relatedArticles?: Article[];
}

export interface CategoriesResponse {
  categories: Category[];
  count: number;
}

export interface CategoryResponse {
  category: Category;
}

export interface SearchResponse {
  articles: Article[];
  query: string;
  pagination: PaginationInfo;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserResponse {
  user: User;
}

export interface HealthResponse {
  message: string;
  environment: string;
  timestamp: string;
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  tags?: string[];
  author?: string;
  status?: string;
}

// UI-specific types
export interface NavItem {
  name: string;
  href: string;
  current?: boolean;
}

export interface SearchFilters {
  categories: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy: 'relevance' | 'date' | 'popularity';
}

export interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  showCategory?: boolean;
  showAuthor?: boolean;
  showExcerpt?: boolean;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
} 