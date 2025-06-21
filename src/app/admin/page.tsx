'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FiFileText, 
  FiEye, 
  FiHeart, 
  FiShare2, 
  FiPlus,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';
import { articleApi } from '@/lib/api';
import type { Article } from '@/types/api';

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  featuredArticles: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  avgReadTime: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await articleApi.getArticleStats();
        if (response.success && response.data) {
          setStats(response.data.stats);
          setPopularArticles(response.data.popularArticles || []);
          setRecentArticles(response.data.recentArticles || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Articles',
      value: stats?.totalArticles || 0,
      icon: FiFileText,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Published',
      value: stats?.publishedArticles || 0,
      icon: FiEye,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Featured Articles',
      value: stats?.featuredArticles || 0,
      icon: FiStar,
      color: 'bg-yellow-500',
      change: '+5%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your content.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/articles/create"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            New Article
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-600 text-sm font-medium">{card.change}</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Articles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Popular Articles</h3>
            <p className="text-sm text-gray-600 mt-1">Most viewed articles this month</p>
          </div>
          <div className="p-6">
            {popularArticles.length > 0 ? (
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <div key={article.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/articles/edit/${article.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors truncate block"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <FiEye className="w-3 h-3 mr-1" />
                          {article.views?.toLocaleString() || 0}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <FiHeart className="w-3 h-3 mr-1" />
                          {article.likes?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No articles found</p>
            )}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Articles</h3>
            <p className="text-sm text-gray-600 mt-1">Latest articles you've created</p>
          </div>
          <div className="p-6">
            {recentArticles.length > 0 ? (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/articles/edit/${article.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors truncate block"
                      >
                        {article.title}
                      </Link>
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
                        <span className="text-xs text-gray-500">
                          {new Date(article.createdAt || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No articles found</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/articles/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <FiPlus className="w-8 h-8 text-primary mr-4" />
            <div>
              <h4 className="font-medium text-gray-900">Create Article</h4>
              <p className="text-sm text-gray-600">Write a new article</p>
            </div>
          </Link>
          
          <Link
            href="/admin/featured"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <FiStar className="w-8 h-8 text-primary mr-4" />
            <div>
              <h4 className="font-medium text-gray-900">Manage Featured</h4>
              <p className="text-sm text-gray-600">Update featured articles</p>
            </div>
          </Link>
          
          <Link
            href="/admin/articles"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <FiFileText className="w-8 h-8 text-primary mr-4" />
            <div>
              <h4 className="font-medium text-gray-900">View All Articles</h4>
              <p className="text-sm text-gray-600">Manage your content</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 