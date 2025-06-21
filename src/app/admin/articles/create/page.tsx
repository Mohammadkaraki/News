'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiLoader, FiUpload, FiEye, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { articleApi, categoryApi } from '@/lib/api';
import type { Category } from '@/types/api';
import toast from 'react-hot-toast';
import RichTextEditor from '@/components/RichTextEditor';

export default function CreateArticlePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: '',
    imageAlt: '',
    status: 'draft' as 'draft' | 'published',
    featured: false
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        if (response.success && response.data) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) throw new Error('No image selected');

    console.log('Uploading image:', {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      lastModified: new Date(imageFile.lastModified).toISOString()
    });

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    console.log('Upload response:', data);
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);

    try {
      // Upload image first
      const imageUrl = await uploadImage();

      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.categoryId,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: {
          url: imageUrl,
          alt: formData.imageAlt || formData.title
        },
        status,
        featured: formData.featured,
        seo: {
          metaTitle: formData.title,
          metaDescription: formData.excerpt,
          metaKeywords: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }
      };

      console.log('Sending article data:', articleData);
      console.log('Image URL being sent to API:', articleData.image.url);
      
      const response = await articleApi.createArticle(articleData);

      if (response.success) {
        toast.success(`Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
        router.push('/admin/articles');
      } else {
        console.error('Article creation failed:', response);
        const errorResponse = response as any;
        if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
          errorResponse.errors.forEach((error: any) => {
            toast.error(`${error.field}: ${error.message}`);
          });
        } else {
          toast.error(response.error || errorResponse.message || 'Failed to create article');
        }
      }
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error('An error occurred while creating the article');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-8">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-lg"
                placeholder="Enter article title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={4}
                value={formData.excerpt}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Brief description of the article"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length} characters</p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content * (minimum 50 characters)
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article content here... (minimum 50 characters required)"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formData.content.replace(/<[^>]*>/g, '').length} characters
                {formData.content.replace(/<[^>]*>/g, '').length < 50 && (
                  <span className="text-red-500 ml-1">
                    (Need {50 - formData.content.replace(/<[^>]*>/g, '').length} more)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Options */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
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
                  Save Draft
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
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category *</h3>
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
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
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

            {/* Image Upload */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image *</h3>
              
              {!imagePreview ? (
                <div>
                  <label htmlFor="imageFile" className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary cursor-pointer transition-colors">
                      <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 mb-2">
                      Image Description (Alt Text)
                    </label>
                    <input
                      type="text"
                      id="imageAlt"
                      name="imageAlt"
                      value={formData.imageAlt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Describe the image for accessibility"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 