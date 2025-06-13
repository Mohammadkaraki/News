const mongoose = require('mongoose');
const generateSlug = require('../utils/generateSlug');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    default: ''
  },
  color: {
    type: String,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color'],
    default: '#6B7280' // Default gray color
  },
  icon: {
    type: String,
    default: 'folder' // Default icon name
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ createdAt: -1 });

// Virtual for category's articles
categorySchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

// Virtual for article count
categorySchema.virtual('articleCount', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Generate slug from name before saving
categorySchema.pre('save', async function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = await generateSlug(this.name, 'Category');
  }
  next();
});

// Ensure slug is unique
categorySchema.pre('save', async function(next) {
  if (this.isModified('slug') && !this.isNew) {
    const existingCategory = await this.constructor.findOne({
      slug: this.slug,
      _id: { $ne: this._id }
    });
    
    if (existingCategory) {
      const error = new Error('Category slug already exists');
      error.status = 400;
      return next(error);
    }
  }
  next();
});

// Static method to find active categories
categorySchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Static method to find category by slug
categorySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

// Static method to get categories with article counts
categorySchema.statics.findWithArticleCounts = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
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
        articleCount: { $size: '$articles' }
      }
    },
    {
      $project: {
        articles: 0 // Remove the articles array, keep only the count
      }
    },
    {
      $sort: { sortOrder: 1, name: 1 }
    }
  ]);
};

// Instance method to get formatted color
categorySchema.methods.getFormattedColor = function() {
  return {
    hex: this.color,
    rgb: this.hexToRgb(this.color),
    name: this.name.toLowerCase()
  };
};

// Helper method to convert hex to RGB
categorySchema.methods.hexToRgb = function(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Instance method to check if category can be deleted
categorySchema.methods.canBeDeleted = async function() {
  const Article = mongoose.model('Article');
  const articleCount = await Article.countDocuments({ category: this._id });
  return articleCount === 0;
};

// Pre-remove middleware to check for associated articles
categorySchema.pre('remove', async function(next) {
  const canDelete = await this.canBeDeleted();
  if (!canDelete) {
    const error = new Error('Cannot delete category with associated articles');
    error.status = 400;
    return next(error);
  }
  next();
});

// Transform output to include computed fields
categorySchema.methods.toJSON = function() {
  const categoryObject = this.toObject();
  
  // Add computed fields if needed
  categoryObject.colorInfo = this.getFormattedColor();
  
  return categoryObject;
};

module.exports = mongoose.model('Category', categorySchema); 