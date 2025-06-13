const express = require('express');
const { body, param } = require('express-validator');
const {
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
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createCategoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color'),
  body('icon')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Icon name must be between 1 and 50 characters'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer')
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color'),
  body('icon')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Icon name must be between 1 and 50 characters'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const reorderValidation = [
  body('categories')
    .isArray()
    .withMessage('Categories must be an array'),
  body('categories.*.id')
    .isMongoId()
    .withMessage('Each category must have a valid ID')
];

const bulkUpdateValidation = [
  body('action')
    .isIn(['activate', 'deactivate', 'update', 'delete'])
    .withMessage('Action must be activate, deactivate, update, or delete'),
  body('categoryIds')
    .isArray({ min: 1 })
    .withMessage('Category IDs must be a non-empty array'),
  body('categoryIds.*')
    .isMongoId()
    .withMessage('Each category ID must be valid'),
  body('updateData')
    .optional()
    .isObject()
    .withMessage('Update data must be an object')
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID')
];

const slugValidation = [
  param('slug')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid category slug')
];

// Public routes
router.get('/', getCategories);
router.get('/:slug', slugValidation, getCategory);

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

// Admin-only routes for category management
router.use(authorize('admin')); // All routes below require admin role

// Admin category management routes
router.get('/admin/list', getCategoriesAdmin);
router.get('/admin/stats', getCategoryStats);
router.get('/admin/:id', mongoIdValidation, getCategoryById);

// CRUD operations
router.post('/', createCategoryValidation, createCategory);
router.put('/:id', mongoIdValidation, updateCategoryValidation, updateCategory);
router.delete('/:id', mongoIdValidation, deleteCategory);

// Bulk operations
router.put('/bulk/update', bulkUpdateValidation, bulkUpdateCategories);
router.put('/bulk/reorder', reorderValidation, reorderCategories);
router.put('/:id/toggle', mongoIdValidation, toggleCategoryStatus);

module.exports = router; 