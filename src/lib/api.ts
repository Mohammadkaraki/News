import type { 
  Article, 
  Category, 
  User, 
  ApiResponse, 
  PaginatedResponse,
  ArticlesResponse,
  ArticleResponse,
  CategoriesResponse,
  CategoryResponse,
  SearchResponse,
  AuthResponse,
  UserResponse,
  HealthResponse
} from '@/types/api';

// API Configuration and Service Layer
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Auth token management
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Article API
export const articleApi = {
  // Get all articles with pagination and filters
  getArticles: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  } = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.featured) searchParams.append('featured', 'true');

    const queryString = searchParams.toString();
    const endpoint = `/api/articles${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<ArticlesResponse>(endpoint);
  },

  // Get article by slug
  getArticleBySlug: async (slug: string) => {
    return apiRequest<ArticleResponse>(`/api/articles/${slug}`);
  },

  // Search articles
  searchArticles: async (query: string, page = 1) => {
    return apiRequest<SearchResponse>(`/api/articles/search?q=${encodeURIComponent(query)}&page=${page}`);
  },

  // Get articles by category
  getArticlesByCategory: async (categorySlug: string, page = 1) => {
    return apiRequest<{
      articles: Article[];
      category: Category;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/api/articles/category/${categorySlug}?page=${page}`);
  },

  // Get featured articles
  getFeaturedArticles: async () => {
    return apiRequest<{
      articles: Article[];
    }>('/api/articles/featured');
  },

  // Like an article
  likeArticle: async (articleId: string) => {
    return apiRequest<{
      likes: number;
    }>(`/api/articles/${articleId}/like`, {
      method: 'POST',
    });
  },

  // Share an article
  shareArticle: async (articleId: string, platform: string) => {
    return apiRequest<{
      shares: number;
    }>(`/api/articles/${articleId}/share`, {
      method: 'POST',
      body: JSON.stringify({ platform }),
    });
  },

  // Admin functions
  // Get article statistics
  getArticleStats: async () => {
    return apiRequest<{
      stats: {
        totalArticles: number;
        publishedArticles: number;
        draftArticles: number;
        featuredArticles: number;
        totalViews: number;
        totalLikes: number;
        totalShares: number;
        avgReadTime: number;
      };
      popularArticles: Article[];
      recentArticles: Article[];
    }>('/api/articles/stats/overview');
  },

  // Get all articles for admin
  getAdminArticles: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    featured?: string;
    search?: string;
    sort?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.category) searchParams.append('category', params.category);
    if (params.featured) searchParams.append('featured', params.featured);
    if (params.search) searchParams.append('search', params.search);
    if (params.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString();
    const endpoint = `/api/articles/admin/all${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<ArticlesResponse>(endpoint);
  },

  // Create article
  createArticle: async (articleData: any) => {
    return apiRequest<ArticleResponse>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  // Update article
  updateArticle: async (articleId: string, articleData: any) => {
    return apiRequest<ArticleResponse>(`/api/articles/${articleId}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  // Delete article
  deleteArticle: async (articleId: string) => {
    return apiRequest<{ message: string }>(`/api/articles/${articleId}`, {
      method: 'DELETE',
    });
  },

  // Toggle featured status
  toggleFeatureArticle: async (articleId: string, featured: boolean, featuredOrder?: number) => {
    return apiRequest<ArticleResponse>(`/api/articles/${articleId}/feature`, {
      method: 'PUT',
      body: JSON.stringify({ featured, featuredOrder }),
    });
  },

  // Reorder featured articles
  reorderFeaturedArticles: async (articles: { id: string; featuredOrder: number }[]) => {
    return apiRequest<{ articles: Article[] }>('/api/articles/reorder', {
      method: 'PUT',
      body: JSON.stringify({ articles }),
    });
  },
};

// Category API
export const categoryApi = {
  // Get all categories
  getCategories: async () => {
    return apiRequest<CategoriesResponse>('/api/categories');
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    return apiRequest<CategoryResponse>(`/api/categories/${slug}`);
  },
};

// User/Auth API
export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    const response = await apiRequest<AuthResponse>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  // Register
  register: async (name: string, email: string, password: string) => {
    const response = await apiRequest<AuthResponse>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  // Get current user profile
  getProfile: async () => {
    return apiRequest<UserResponse>('/api/users/profile');
  },

  // Update profile
  updateProfile: async (data: Partial<User>) => {
    return apiRequest<UserResponse>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Logout
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// Health check
export const healthApi = {
  check: async () => {
    return apiRequest<HealthResponse>('/health');
  },
};

// Export utilities
export { getAuthToken, setAuthToken, removeAuthToken };
export type { ApiResponse, PaginatedResponse }; 