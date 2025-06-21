const express = require('express');
const { body, param, query } = require('express-validator');
const {
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
  toggleFeatureArticle,
  reorderFeaturedArticles,
  getAdminArticles
} = require('../controllers/articleController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createArticleValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('excerpt')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Excerpt must be between 10 and 300 characters'),
  body('content')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),
  body('image.url')
    .custom((value) => {
      // Allow localhost URLs for development and standard URLs for production
      const urlPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1|[\w\-]+\.[\w\-]+)(:\d+)?(\/.*)?$/;
      if (!urlPattern.test(value)) {
        throw new Error('Image URL must be valid');
      }
      return true;
    })
    .withMessage('Image URL must be valid'),
  body('image.alt')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Image alt text cannot exceed 100 characters'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Each tag must be between 2 and 30 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be draft or published'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('seo.metaTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Meta title cannot exceed 60 characters'),
  body('seo.metaDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Meta description cannot exceed 160 characters')
];

const updateArticleValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Excerpt must be between 10 and 300 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),
  body('image.url')
    .optional()
    .custom((value) => {
      if (value) {
        // Allow localhost URLs for development and standard URLs for production
        const urlPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1|[\w\-]+\.[\w\-]+)(:\d+)?(\/.*)?$/;
        if (!urlPattern.test(value)) {
          throw new Error('Image URL must be valid');
        }
      }
      return true;
    })
    .withMessage('Image URL must be valid'),
  body('image.alt')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Image alt text cannot exceed 100 characters'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Each tag must be between 2 and 30 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('seo.metaTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Meta title cannot exceed 60 characters'),
  body('seo.metaDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Meta description cannot exceed 160 characters')
];

const shareValidation = [
  body('platform')
    .optional()
    .isIn(['facebook', 'twitter', 'linkedin', 'general'])
    .withMessage('Platform must be facebook, twitter, linkedin, or general')
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid article ID')
];

const slugValidation = [
  param('slug')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Invalid article slug')
];

const categorySlugValidation = [
  param('slug')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid category slug')
];

// Add new validation rules for admin features
const featureValidation = [
  body('featured').isBoolean().withMessage('Featured must be a boolean'),
  body('featuredOrder').optional().isInt({ min: 1 }).withMessage('Featured order must be a positive integer')
];

const reorderValidation = [
  body('articles').isArray().withMessage('Articles must be an array'),
  body('articles.*.id').isMongoId().withMessage('Invalid article ID'),
  body('articles.*.featuredOrder').isInt({ min: 1 }).withMessage('Featured order must be a positive integer')
];

// Public routes
router.get('/', getArticles);
router.get('/featured', getFeaturedArticles);
router.get('/popular', getPopularArticles);
router.get('/search', searchArticles);
router.get('/category/:slug', categorySlugValidation, getArticlesByCategory);

// Public routes with optional auth (for personalized content)
router.get('/:slug', optionalAuth, slugValidation, getArticle);
router.post('/:id/like', mongoIdValidation, likeArticle);
router.post('/:id/share', mongoIdValidation, shareValidation, shareArticle);

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

// Statistics route (accessible to all authenticated users)
router.get('/stats/overview', getArticleStats);

// Admin routes for article management
router.use(authorize('admin', 'editor')); // Admin/Editor only routes

// Admin article listing with additional fields
router.get('/admin/all', getAdminArticles);

// Feature article toggle
router.put('/:id/feature', mongoIdValidation, featureValidation, toggleFeatureArticle);

// Reorder featured articles
router.put('/reorder', reorderValidation, reorderFeaturedArticles);

// Article CRUD operations
router.post('/', createArticleValidation, createArticle);
router.put('/:id', mongoIdValidation, updateArticleValidation, updateArticle);
router.delete('/:id', mongoIdValidation, deleteArticle);

module.exports = router; 