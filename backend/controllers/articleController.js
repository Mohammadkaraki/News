const { validationResult } = require('express-validator');
const Article = require('../models/Article');
const Category = require('../models/Category');
const { asyncHandler, createError, formatValidationErrors } = require('../middleware/errorHandler');

/**
 * @desc    Get all published articles
 * @route   GET /api/articles
 * @access  Public
 */
const getArticles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query for published articles
  const query = { status: 'published' };

  // Add filters
  if (req.query.category) {
    const category = await Category.findOne({ slug: req.query.category });
    if (category) {
      query.category = category._id;
    }
  }

  if (req.query.author) {
    query.author = req.query.author;
  }

  if (req.query.featured) {
    query.featured = req.query.featured === 'true';
  }

  if (req.query.tags) {
    const tags = req.query.tags.split(',').map(tag => tag.trim());
    query.tags = { $in: tags };
  }

  // Search functionality
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { excerpt: { $regex: req.query.search, $options: 'i' } },
      { content: { $regex: req.query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } }
    ];
  }

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    query.publishedAt = {};
    if (req.query.startDate) {
      query.publishedAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.publishedAt.$lte = new Date(req.query.endDate);
    }
  }

  // Sort options
  let sortOption = { publishedAt: -1 }; // Default: newest first
  
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'oldest':
        sortOption = { publishedAt: 1 };
        break;
      case 'popular':
        sortOption = { views: -1, likes: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      case 'readTime':
        sortOption = { readTime: 1 };
        break;
      default:
        sortOption = { publishedAt: -1 };
    }
  }

  const articles = await Article.find(query)
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Article.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        category: req.query.category,
        author: req.query.author,
        featured: req.query.featured,
        tags: req.query.tags,
        search: req.query.search,
        sort: req.query.sort
      }
    }
  });
});

/**
 * @desc    Get single article by slug
 * @route   GET /api/articles/:slug
 * @access  Public
 */
const getArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findBySlug(req.params.slug);

  if (!article) {
    return next(createError.notFound('Article not found'));
  }

  // Increment views (don't await to avoid slowing response)
  article.incrementViews().catch(err => 
    console.error('Error incrementing views:', err)
  );

  // Get related articles
  const relatedArticles = await article.getRelatedArticles(3);

  res.status(200).json({
    success: true,
    data: {
      article,
      relatedArticles
    }
  });
});

/**
 * @desc    Create new article
 * @route   POST /api/articles
 * @access  Private (Editor/Admin)
 */
const createArticle = asyncHandler(async (req, res, next) => {
  // Debug logging
  console.log('Create article request body:', JSON.stringify(req.body, null, 2));
  
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    const formattedErrors = formatValidationErrors(errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  // Verify category exists
  const category = await Category.findById(req.body.category);
  if (!category) {
    return next(createError.badRequest('Invalid category'));
  }

  // Add author from authenticated user
  req.body.author = req.user._id;

  const article = await Article.create(req.body);
  
  // Populate the response
  await article.populate('category', 'name slug color');
  await article.populate('author', 'name email avatar');

  res.status(201).json({
    success: true,
    message: 'Article created successfully',
    data: {
      article
    }
  });
});

/**
 * @desc    Update article
 * @route   PUT /api/articles/:id
 * @access  Private (Owner/Editor/Admin)
 */
const updateArticle = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  let article = await Article.findById(req.params.id);

  if (!article) {
    return next(createError.notFound('Article not found'));
  }

  // Check if user can edit this article
  if (!article.canBeEditedBy(req.user)) {
    return next(createError.forbidden('Not authorized to edit this article'));
  }

  // Verify category exists if being updated
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(createError.badRequest('Invalid category'));
    }
  }

  article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('category', 'name slug color')
   .populate('author', 'name email avatar');

  res.status(200).json({
    success: true,
    message: 'Article updated successfully',
    data: {
      article
    }
  });
});

/**
 * @desc    Delete article
 * @route   DELETE /api/articles/:id
 * @access  Private (Owner/Editor/Admin)
 */
const deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(createError.notFound('Article not found'));
  }

  // Check if user can delete this article
  if (!article.canBeEditedBy(req.user)) {
    return next(createError.forbidden('Not authorized to delete this article'));
  }

  await article.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Article deleted successfully'
  });
});

/**
 * @desc    Get featured articles
 * @route   GET /api/articles/featured
 * @access  Public
 */
const getFeaturedArticles = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  const articles = await Article.find({ 
    status: 'published', 
    featured: true 
  })
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .sort({ featuredOrder: 1, publishedAt: -1 }) // Sort by featuredOrder first, then by publish date
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      articles
    }
  });
});

/**
 * @desc    Get popular articles
 * @route   GET /api/articles/popular
 * @access  Public
 */
const getPopularArticles = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const articles = await Article.findPopular(limit);

  res.status(200).json({
    success: true,
    data: {
      articles
    }
  });
});

/**
 * @desc    Search articles
 * @route   GET /api/articles/search
 * @access  Public
 */
const searchArticles = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const articles = await Article.searchArticles(q)
    .skip(skip)
    .limit(limit);

  const totalResults = await Article.searchArticles(q).countDocuments();

  res.status(200).json({
    success: true,
    data: {
      articles,
      query: q,
      pagination: {
        page,
        limit,
        total: totalResults,
        pages: Math.ceil(totalResults / limit)
      }
    }
  });
});

/**
 * @desc    Get articles by category
 * @route   GET /api/articles/category/:slug
 * @access  Public
 */
const getArticlesByCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findBySlug(req.params.slug);
  
  if (!category) {
    return next(createError.notFound('Category not found'));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const articles = await Article.findByCategory(category._id)
    .skip(skip)
    .limit(limit);

  const total = await Article.countDocuments({ 
    category: category._id, 
    status: 'published' 
  });

  res.status(200).json({
    success: true,
    data: {
      articles,
      category,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * @desc    Like article
 * @route   POST /api/articles/:id/like
 * @access  Public
 */
const likeArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(createError.notFound('Article not found'));
  }

  if (article.status !== 'published') {
    return next(createError.badRequest('Cannot like unpublished article'));
  }

  await article.incrementLikes();

  res.status(200).json({
    success: true,
    message: 'Article liked successfully',
    data: {
      likes: article.likes
    }
  });
});

/**
 * @desc    Share article
 * @route   POST /api/articles/:id/share
 * @access  Public
 */
const shareArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(createError.notFound('Article not found'));
  }

  if (article.status !== 'published') {
    return next(createError.badRequest('Cannot share unpublished article'));
  }

  const platform = req.body.platform || 'general';
  await article.incrementShares(platform);

  res.status(200).json({
    success: true,
    message: 'Article shared successfully',
    data: {
      shares: article.shares,
      socialShares: article.analytics.socialShares
    }
  });
});

/**
 * @desc    Get article statistics (Admin/Editor)
 * @route   GET /api/articles/stats
 * @access  Private (Editor/Admin)
 */
const getArticleStats = asyncHandler(async (req, res) => {
  // Build query based on user role
  const query = {};
  if (req.user.role === 'user') {
    query.author = req.user._id;
  }

  const stats = await Article.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalArticles: { $sum: 1 },
        publishedArticles: {
          $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
        },
        draftArticles: {
          $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
        },
        featuredArticles: {
          $sum: { $cond: ['$featured', 1, 0] }
        },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: '$likes' },
        totalShares: { $sum: '$shares' },
        avgReadTime: { $avg: '$readTime' }
      }
    }
  ]);

  // Get most popular articles
  const popularArticles = await Article.find(query)
    .select('title slug views likes publishedAt')
    .sort({ views: -1 })
    .limit(5);

  // Get recent articles
  const recentArticles = await Article.find(query)
    .select('title slug status publishedAt createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      stats: stats[0] || {
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        featuredArticles: 0,
        totalViews: 0,
        totalLikes: 0,
        totalShares: 0,
        avgReadTime: 0
      },
      popularArticles,
      recentArticles
    }
  });
});

/**
 * @desc    Get all articles for admin (includes drafts, analytics)
 * @route   GET /api/articles/admin/all
 * @access  Private (Admin/Editor)
 */
const getAdminArticles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};

  // Filter by status
  if (req.query.status && req.query.status !== 'all') {
    query.status = req.query.status;
  }

  // Filter by featured
  if (req.query.featured === 'true') {
    query.featured = true;
  }

  // Filter by category
  if (req.query.category) {
    const category = await Category.findOne({ slug: req.query.category });
    if (category) {
      query.category = category._id;
    }
  }

  // Search functionality
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { excerpt: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Sort options
  let sortOption = { createdAt: -1 }; // Default: newest first
  
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'title':
        sortOption = { title: 1 };
        break;
      case 'publishedAt':
        sortOption = { publishedAt: -1 };
        break;
      case 'views':
        sortOption = { views: -1 };
        break;
      case 'featured':
        sortOption = { featured: -1, featuredOrder: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const articles = await Article.find(query)
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .select('title slug excerpt status featured featuredOrder publishedAt createdAt views likes shares category author')
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Article.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        status: req.query.status,
        category: req.query.category,
        featured: req.query.featured,
        search: req.query.search,
        sort: req.query.sort
      }
    }
  });
});

/**
 * @desc    Toggle featured status of article
 * @route   PUT /api/articles/:id/feature
 * @access  Private (Admin/Editor)
 */
const toggleFeatureArticle = asyncHandler(async (req, res, next) => {
  const { featured, featuredOrder } = req.body;
  
  const article = await Article.findById(req.params.id);
  
  if (!article) {
    return next(createError.notFound('Article not found'));
  }

  // If setting as featured and no order specified, find next available order
  if (featured && !featuredOrder) {
    const maxOrder = await Article.findOne({ featured: true })
      .select('featuredOrder')
      .sort({ featuredOrder: -1 });
    
    req.body.featuredOrder = maxOrder ? maxOrder.featuredOrder + 1 : 1;
  } else if (!featured) {
    // If removing from featured, clear the order
    req.body.featuredOrder = null;
  }

  // Update article
  const updatedArticle = await Article.findByIdAndUpdate(
    req.params.id,
    {
      featured: req.body.featured,
      featuredOrder: req.body.featuredOrder
    },
    { new: true, runValidators: true }
  ).populate('category', 'name slug color')
   .populate('author', 'name email avatar');

  res.status(200).json({
    success: true,
    message: `Article ${featured ? 'featured' : 'unfeatured'} successfully`,
    data: {
      article: updatedArticle
    }
  });
});

/**
 * @desc    Reorder featured articles
 * @route   PUT /api/articles/reorder
 * @access  Private (Admin/Editor)
 */
const reorderFeaturedArticles = asyncHandler(async (req, res, next) => {
  const { articles } = req.body;

  // Validate that all articles exist and are currently featured
  const articleIds = articles.map(item => item.id);
  const existingArticles = await Article.find({
    _id: { $in: articleIds },
    featured: true
  });

  if (existingArticles.length !== articles.length) {
    return next(createError.badRequest('Some articles are not found or not featured'));
  }

  // Update featured order for each article
  const updatePromises = articles.map(item =>
    Article.findByIdAndUpdate(
      item.id,
      { featuredOrder: item.featuredOrder },
      { new: true }
    )
  );

  await Promise.all(updatePromises);

  // Get updated featured articles in new order
  const updatedArticles = await Article.find({ featured: true })
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .sort({ featuredOrder: 1 });

  res.status(200).json({
    success: true,
    message: 'Featured articles reordered successfully',
    data: {
      articles: updatedArticles
    }
  });
});

module.exports = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getFeaturedArticles,
  getPopularArticles,
  searchArticles,
  getArticlesByCategory,
  likeArticle,
  shareArticle,
  getArticleStats,
  getAdminArticles,
  toggleFeatureArticle,
  reorderFeaturedArticles
}; 