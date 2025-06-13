const { validationResult } = require('express-validator');
const Category = require('../models/Category');
const Article = require('../models/Article');
const { asyncHandler, createError, formatValidationErrors } = require('../middleware/errorHandler');

/**
 * @desc    Get all active categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const includeArticleCount = req.query.includeCount === 'true';

  let categories;

  if (includeArticleCount) {
    categories = await Category.findWithArticleCounts();
  } else {
    categories = await Category.findActive();
  }

  res.status(200).json({
    success: true,
    data: {
      categories,
      count: categories.length
    }
  });
});

/**
 * @desc    Get single category by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findBySlug(req.params.slug);

  if (!category) {
    return next(createError.notFound('Category not found'));
  }

  // Get article count for this category
  const articleCount = await Article.countDocuments({ 
    category: category._id, 
    status: 'published' 
  });

  // Get recent articles in this category
  const recentArticles = await Article.findByCategory(category._id)
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      category: {
        ...category.toObject(),
        articleCount
      },
      recentArticles
    }
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private (Admin only)
 */
const createCategory = asyncHandler(async (req, res, next) => {
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

  // Add creator to the category
  req.body.createdBy = req.user._id;

  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: {
      category
    }
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin only)
 */
const updateCategory = asyncHandler(async (req, res, next) => {
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

  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(createError.notFound('Category not found'));
  }

  category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: {
      category
    }
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin only)
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(createError.notFound('Category not found'));
  }

  // Check if category has articles
  const articleCount = await Article.countDocuments({ category: category._id });
  
  if (articleCount > 0) {
    return next(createError.badRequest(
      `Cannot delete category with ${articleCount} associated articles. Please move or delete the articles first.`
    ));
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

/**
 * @desc    Get all categories for admin
 * @route   GET /api/categories/admin
 * @access  Private (Admin only)
 */
const getCategoriesAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const categories = await Category.find(query)
    .populate('createdBy', 'name email')
    .sort({ sortOrder: 1, name: 1 })
    .skip(skip)
    .limit(limit);

  // Get article counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const articleCount = await Article.countDocuments({ 
        category: category._id 
      });
      const publishedArticleCount = await Article.countDocuments({ 
        category: category._id, 
        status: 'published' 
      });
      
      return {
        ...category.toObject(),
        articleCount,
        publishedArticleCount
      };
    })
  );

  const total = await Category.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      categories: categoriesWithCounts,
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
 * @desc    Get category by ID (Admin)
 * @route   GET /api/categories/admin/:id
 * @access  Private (Admin only)
 */
const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!category) {
    return next(createError.notFound('Category not found'));
  }

  // Get detailed statistics
  const stats = await Article.aggregate([
    { $match: { category: category._id } },
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
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: '$likes' },
        avgReadTime: { $avg: '$readTime' }
      }
    }
  ]);

  // Get recent articles in this category
  const recentArticles = await Article.find({ category: category._id })
    .select('title slug status publishedAt views likes')
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      category,
      stats: stats[0] || {
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        totalViews: 0,
        totalLikes: 0,
        avgReadTime: 0
      },
      recentArticles
    }
  });
});

/**
 * @desc    Update category sort order
 * @route   PUT /api/categories/reorder
 * @access  Private (Admin only)
 */
const reorderCategories = asyncHandler(async (req, res, next) => {
  const { categories } = req.body;

  if (!Array.isArray(categories)) {
    return next(createError.badRequest('Categories must be an array'));
  }

  // Update sort order for each category
  const updatePromises = categories.map((item, index) => {
    return Category.findByIdAndUpdate(
      item.id,
      { sortOrder: index },
      { new: true }
    );
  });

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'Category order updated successfully'
  });
});

/**
 * @desc    Toggle category active status
 * @route   PUT /api/categories/:id/toggle
 * @access  Private (Admin only)
 */
const toggleCategoryStatus = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(createError.notFound('Category not found'));
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    success: true,
    message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      category
    }
  });
});

/**
 * @desc    Get category statistics
 * @route   GET /api/categories/stats
 * @access  Private (Admin only)
 */
const getCategoryStats = asyncHandler(async (req, res) => {
  const stats = await Category.aggregate([
    {
      $group: {
        _id: null,
        totalCategories: { $sum: 1 },
        activeCategories: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        inactiveCategories: {
          $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
        }
      }
    }
  ]);

  // Get categories with most articles
  const categoriesWithArticles = await Category.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'articles',
        localField: '_id',
        foreignField: 'category',
        as: 'articles'
      }
    },
    {
      $addFields: {
        articleCount: { $size: '$articles' },
        publishedArticleCount: {
          $size: {
            $filter: {
              input: '$articles',
              cond: { $eq: ['$$this.status', 'published'] }
            }
          }
        }
      }
    },
    {
      $sort: { articleCount: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        name: 1,
        slug: 1,
        color: 1,
        articleCount: 1,
        publishedArticleCount: 1
      }
    }
  ]);

  // Get recent categories
  const recentCategories = await Category.find()
    .select('name slug isActive createdAt')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      stats: stats[0] || {
        totalCategories: 0,
        activeCategories: 0,
        inactiveCategories: 0
      },
      topCategories: categoriesWithArticles,
      recentCategories
    }
  });
});

/**
 * @desc    Bulk update categories
 * @route   PUT /api/categories/bulk
 * @access  Private (Admin only)
 */
const bulkUpdateCategories = asyncHandler(async (req, res, next) => {
  const { action, categoryIds, updateData } = req.body;

  if (!action || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    return next(createError.badRequest('Action and category IDs are required'));
  }

  let result;

  switch (action) {
    case 'activate':
      result = await Category.updateMany(
        { _id: { $in: categoryIds } },
        { isActive: true }
      );
      break;

    case 'deactivate':
      result = await Category.updateMany(
        { _id: { $in: categoryIds } },
        { isActive: false }
      );
      break;

    case 'update':
      if (!updateData) {
        return next(createError.badRequest('Update data is required'));
      }
      result = await Category.updateMany(
        { _id: { $in: categoryIds } },
        updateData
      );
      break;

    case 'delete':
      // Check if any categories have articles
      const categoriesWithArticles = await Article.find({
        category: { $in: categoryIds }
      }).distinct('category');

      if (categoriesWithArticles.length > 0) {
        return next(createError.badRequest(
          'Cannot delete categories that have associated articles'
        ));
      }

      result = await Category.deleteMany({ _id: { $in: categoryIds } });
      break;

    default:
      return next(createError.badRequest('Invalid action'));
  }

  res.status(200).json({
    success: true,
    message: `Bulk ${action} completed successfully`,
    data: {
      modifiedCount: result.modifiedCount || result.deletedCount,
      matchedCount: result.matchedCount || categoryIds.length
    }
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesAdmin,
  getCategoryById,
  reorderCategories,
  toggleCategoryStatus,
  getCategoryStats,
  bulkUpdateCategories
}; 