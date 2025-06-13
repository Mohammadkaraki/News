const mongoose = require('mongoose');
const generateSlug = require('../utils/generateSlug');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an article title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an article excerpt'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide article content']
  },
  image: {
    url: {
      type: String,
      required: [true, 'Please provide an image URL']
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    },
    publicId: String // For Cloudinary
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please provide an author']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  featuredOrder: {
    type: Number,
    default: null,
    sparse: true // Only index documents where featuredOrder exists
  },
  publishedAt: {
    type: Date
  },
  readTime: {
    type: Number, // in minutes
    default: 1
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  // SEO fields
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    metaKeywords: [String],
    ogImage: String,
    canonicalUrl: String
  },
  // Content structure
  sections: [{
    type: {
      type: String,
      enum: ['paragraph', 'heading', 'image', 'quote', 'list'],
      default: 'paragraph'
    },
    content: String,
    order: Number
  }],
  // Analytics
  analytics: {
    bounceRate: {
      type: Number,
      default: 0
    },
    avgTimeOnPage: {
      type: Number,
      default: 0
    },
    socialShares: {
      facebook: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 },
      linkedin: { type: Number, default: 0 }
    }
  },
  // Moderation
  moderation: {
    isModerated: {
      type: Boolean,
      default: false
    },
    moderatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    flags: [{
      type: String,
      enum: ['inappropriate', 'spam', 'plagiarism', 'copyright']
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
articleSchema.index({ slug: 1 });
articleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ featured: 1 });
articleSchema.index({ featured: 1, featuredOrder: 1 }); // For featured articles ordering
articleSchema.index({ featuredOrder: 1 }); // For reordering operations
articleSchema.index({ tags: 1 });
articleSchema.index({ views: -1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ publishedAt: -1 });

// Virtual for formatted publish date
articleSchema.virtual('formattedPublishDate').get(function() {
  if (!this.publishedAt) return null;
  return this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for relative publish time
articleSchema.virtual('timeAgo').get(function() {
  if (!this.publishedAt) return null;
  
  const now = new Date();
  const diffInMs = now - this.publishedAt;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${diffInDays} days ago`;
  }
});

// Virtual for word count
articleSchema.virtual('wordCount').get(function() {
  if (!this.content) return 0;
  return this.content.split(/\s+/).filter(word => word.length > 0).length;
});

// Generate slug from title before saving
articleSchema.pre('save', async function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = await generateSlug(this.title, 'Article');
  }
  next();
});

// Calculate read time before saving
articleSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = this.wordCount;
    this.readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
  next();
});

// Auto-populate SEO fields if not provided
articleSchema.pre('save', function(next) {
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.title.substring(0, 60);
  }
  
  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.excerpt.substring(0, 160);
  }
  
  next();
});

// Set publishedAt when status changes to published
articleSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Static methods
articleSchema.statics.findPublished = function() {
  return this.find({ status: 'published' })
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .sort({ publishedAt: -1 });
};

articleSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, status: 'published' })
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar bio');
};

articleSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, status: 'published' })
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .sort({ publishedAt: -1 });
};

articleSchema.statics.findByAuthor = function(authorId) {
  return this.find({ author: authorId, status: 'published' })
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .sort({ publishedAt: -1 });
};

articleSchema.statics.findFeatured = function(limit = 5) {
  return this.find({ featured: true, status: 'published' })
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

articleSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .populate('category', 'name slug color')
    .populate('author', 'name email avatar')
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

articleSchema.statics.searchArticles = function(query) {
  return this.find({
    $and: [
      { status: 'published' },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { excerpt: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  })
  .populate('category', 'name slug color')
  .populate('author', 'name email avatar')
  .sort({ publishedAt: -1 });
};

// Instance methods
articleSchema.methods.incrementViews = function() {
  this.views = (this.views || 0) + 1;
  return this.save();
};

articleSchema.methods.incrementLikes = function() {
  this.likes = (this.likes || 0) + 1;
  return this.save();
};

articleSchema.methods.incrementShares = function(platform = 'general') {
  this.shares = (this.shares || 0) + 1;
  
  if (platform && this.analytics.socialShares[platform] !== undefined) {
    this.analytics.socialShares[platform]++;
  }
  
  return this.save();
};

articleSchema.methods.isPublished = function() {
  return this.status === 'published' && this.publishedAt;
};

articleSchema.methods.canBeEditedBy = function(user) {
  if (!user) return false;
  
  // Admin can edit any article
  if (user.role === 'admin') return true;
  
  // Editor can edit any article
  if (user.role === 'editor') return true;
  
  // Author can edit their own articles
  return this.author.toString() === user._id.toString();
};

articleSchema.methods.getRelatedArticles = async function(limit = 5) {
  return this.constructor.find({
    _id: { $ne: this._id },
    status: 'published',
    $or: [
      { category: this.category },
      { tags: { $in: this.tags } }
    ]
  })
  .populate('category', 'name slug color')
  .populate('author', 'name email avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Transform output
articleSchema.methods.toJSON = function() {
  const articleObject = this.toObject();
  
  // Add computed fields
  articleObject.isPublished = this.isPublished();
  articleObject.url = `/articles/${this.slug}`;
  
  return articleObject;
};

module.exports = mongoose.model('Article', articleSchema); 