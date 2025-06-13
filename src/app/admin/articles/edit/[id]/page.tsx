'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiLoader, FiEye, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { articleApi, categoryApi } from '@/lib/api';
import type { Category, Article } from '@/types/api';
import toast from 'react-hot-toast';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditArticlePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: '',
    imageUrl: '',
    imageAlt: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleResponse, categoriesResponse] = await Promise.all([
          articleApi.getArticleBySlug(articleId), // Assuming this can take ID too
          categoryApi.getCategories()
        ]);

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data.categories);
        }

        if (articleResponse.success && articleResponse.data) {
          const articleData = articleResponse.data.article;
          setArticle(articleData);
          setFormData({
            title: articleData.title || '',
            excerpt: articleData.excerpt || '',
            content: articleData.content || '',
            categoryId: articleData.category?.id || articleData.category?._id || '',
            tags: articleData.tags ? articleData.tags.join(', ') : '',
            imageUrl: articleData.image?.url || '',
            imageAlt: articleData.image?.alt || '',
            status: articleData.status || 'draft',
            featured: articleData.featured || false,
            seo: {
              metaTitle: articleData.seo?.metaTitle || '',
              metaDescription: articleData.seo?.metaDescription || '',
              metaKeywords: articleData.seo?.metaKeywords ? articleData.seo.metaKeywords.join(', ') : ''
            }
          });
        } else {
          toast.error('Article not found');
          router.push('/admin/articles');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load article');
        router.push('/admin/articles');
      } finally {
        setInitialLoading(false);
      }
    };

    if (articleId) {
      fetchData();
    }
  }, [articleId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status?: 'draft' | 'published' | 'archived') => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.imageUrl) {
      toast.error('Please provide an image URL');
      return;
    }

    setLoading(true);

    try {
      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.categoryId,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: {
          url: formData.imageUrl,
          alt: formData.imageAlt || formData.title
        },
        status: status || formData.status,
        featured: formData.featured,
        seo: {
          metaTitle: formData.seo.metaTitle || formData.title,
          metaDescription: formData.seo.metaDescription || formData.excerpt,
          metaKeywords: formData.seo.metaKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
        }
      };

      const response = await articleApi.updateArticle(articleId, articleData);

      if (response.success) {
        toast.success(`Article ${status === 'published' ? 'published' : 'updated'} successfully!`);
        router.push('/admin/articles');
      } else {
        toast.error(response.error || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('An error occurred while updating the article');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await articleApi.deleteArticle(articleId);

      if (response.success) {
        toast.success('Article deleted successfully!');
        router.push('/admin/articles');
      } else {
        toast.error(response.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('An error occurred while deleting the article');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <Link href="/admin/articles" className="text-primary hover:text-primary-700">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/articles"
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Articles
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          <FiTrash2 className="w-4 h-4 mr-2" />
          Delete Article
        </button>
      </div>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Enter article title"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Brief description of the article (max 300 characters)"
                maxLength={300}
                required
              />
              <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article content here..."
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="seo.metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="seo.metaTitle"
                    name="seo.metaTitle"
                    value={formData.seo.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="SEO title (leave empty to use article title)"
                    maxLength={60}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.seo.metaTitle.length}/60 characters</p>
                </div>

                <div>
                  <label htmlFor="seo.metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="seo.metaDescription"
                    name="seo.metaDescription"
                    rows={2}
                    value={formData.seo.metaDescription}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="SEO description (leave empty to use excerpt)"
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.seo.metaDescription.length}/160 characters</p>
                </div>

                <div>
                  <label htmlFor="seo.metaKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    id="seo.metaKeywords"
                    name="seo.metaKeywords"
                    value={formData.seo.metaKeywords}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Options */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                    Featured Article
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <FiLoader className="w-4 h-4 animate-spin mr-2" /> : <FiSave className="w-4 h-4 mr-2" />}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'published')}
                  disabled={loading}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <FiLoader className="w-4 h-4 animate-spin mr-2" /> : <FiEye className="w-4 h-4 mr-2" />}
                  Publish
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-sm text-gray-500 mt-2">Separate tags with commas</p>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    id="imageAlt"
                    name="imageAlt"
                    value={formData.imageAlt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Description of the image"
                  />
                </div>

                {formData.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Article Info */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Created:</strong> {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Updated:</strong> {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Views:</strong> {article.views?.toLocaleString() || 0}</p>
                <p><strong>Likes:</strong> {article.likes?.toLocaleString() || 0}</p>
                <p><strong>Shares:</strong> {article.shares?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 