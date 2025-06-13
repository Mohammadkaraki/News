'use client';

import { useState, useEffect } from 'react';
import { 
  FiEye, 
  FiHeart, 
  FiShare2, 
  FiFileText, 
  FiTrendingUp, 
  FiUsers,
  FiCalendar,
  FiBarChart
} from 'react-icons/fi';
import { articleApi } from '@/lib/api';
import type { Article } from '@/types/api';

interface AnalyticsStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  featuredArticles: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  avgReadTime: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await articleApi.getArticleStats();
        
        if (response.success && response.data) {
          setStats(response.data.stats);
          setPopularArticles(response.data.popularArticles || []);
          setRecentArticles(response.data.recentArticles || []);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const engagementRate = stats ? 
    ((stats.totalLikes + stats.totalShares) / Math.max(stats.totalViews, 1) * 100).toFixed(2) : '0';

  const publishedRate = stats ? 
    ((stats.publishedArticles / Math.max(stats.totalArticles, 1)) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your content performance and engagement</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalArticles?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FiFileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-600 text-sm font-medium">
              {publishedRate}% published
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalViews?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <FiEye className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-600 text-sm font-medium">
              +12% from last period
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {engagementRate}%
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-600 text-sm font-medium">
              +8% from last period
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Read Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.avgReadTime || 0} min
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-600 text-sm font-medium">
              +5% from last period
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Likes</h3>
            <FiHeart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalLikes?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {stats && stats.totalViews > 0 ? 
              ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) : '0'}% like rate
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Shares</h3>
            <FiShare2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalShares?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {stats && stats.totalViews > 0 ? 
              ((stats.totalShares / stats.totalViews) * 100).toFixed(1) : '0'}% share rate
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Featured</h3>
            <FiBarChart className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.featuredArticles?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {stats && stats.totalArticles > 0 ? 
              ((stats.featuredArticles / stats.totalArticles) * 100).toFixed(1) : '0'}% of total
          </p>
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Articles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Articles</h3>
            <p className="text-sm text-gray-600 mt-1">Articles with highest engagement</p>
          </div>
          <div className="p-6">
            {popularArticles.length > 0 ? (
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <div key={article.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <FiEye className="w-3 h-3 mr-1" />
                          {article.views?.toLocaleString() || 0}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <FiHeart className="w-3 h-3 mr-1" />
                          {article.likes?.toLocaleString() || 0}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <FiShare2 className="w-3 h-3 mr-1" />
                          {article.shares?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {((article.likes || 0) + (article.shares || 0))} 
                      </div>
                      <div className="text-xs text-gray-500">engagements</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No articles found</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600 mt-1">Latest published articles</p>
          </div>
          <div className="p-6">
            {recentArticles.length > 0 ? (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : article.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status}
                        </span>
                        {article.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {article.publishedAt ? 
                          new Date(article.publishedAt).toLocaleDateString() : 
                          'Not published'
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent articles</p>
            )}
          </div>
        </div>
      </div>

      {/* Content Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Content Distribution</h3>
          <p className="text-sm text-gray-600 mt-1">Article status breakdown</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.publishedArticles || 0}
              </div>
              <div className="text-sm font-medium text-gray-900">Published</div>
              <div className="text-xs text-gray-500 mt-1">
                {publishedRate}% of total
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {stats?.draftArticles || 0}
              </div>
              <div className="text-sm font-medium text-gray-900">Drafts</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats && stats.totalArticles > 0 ? 
                  ((stats.draftArticles / stats.totalArticles) * 100).toFixed(1) : '0'}% of total
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats?.featuredArticles || 0}
              </div>
              <div className="text-sm font-medium text-gray-900">Featured</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats && stats.publishedArticles > 0 ? 
                  ((stats.featuredArticles / stats.publishedArticles) * 100).toFixed(1) : '0'}% of published
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 