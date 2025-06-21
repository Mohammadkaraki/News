const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');

// Import models directly (since we're in the same project)
const Article = require('../../models/Article');
const Category = require('../../models/Category');
const User = require('../../models/User');

// Load test config if .env issues
let testConfig = null;
try {
    testConfig = require('../test-config');
} catch (e) {
    // Fall back to env vars
}

class ArticleService {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'http://localhost:5000/api';
        this.defaultAuthorId = process.env.DEFAULT_AUTHOR_ID || null;
        this.useDirectDB = testConfig?.USE_DIRECT_DB || process.env.USE_DIRECT_DB === 'true' || true;
        this.mongoUri = testConfig?.MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/news-db';
    }

    async createArticle(articleData) {
        if (this.useDirectDB) {
            return await this.createArticleDirectDB(articleData);
        } else {
            return await this.createArticleAPI(articleData);
        }
    }

    async createArticleDirectDB(articleData) {
        try {
            // Ensure database connection
            if (mongoose.connection.readyState !== 1) {
                console.log('⚠️  Database not connected, attempting to connect...');
                // Set MONGODB_URI from our config if not set
                if (!process.env.MONGODB_URI && this.mongoUri) {
                    process.env.MONGODB_URI = this.mongoUri;
                }
                const { connectDB } = require('../../config/db');
                await connectDB();
            }

            // Get category by slug
            const category = await Category.findOne({ 
                slug: articleData.categorySlug, 
                isActive: true 
            });
            
            if (!category) {
                throw new Error(`Category with slug '${articleData.categorySlug}' not found`);
            }

            // Get default author or create system user
            let author = null;
            if (this.defaultAuthorId) {
                author = await User.findById(this.defaultAuthorId);
            }
            
            if (!author) {
                author = await this.getOrCreateSystemUser();
            }

            // Prepare article data
            const article = new Article({
                title: articleData.title,
                excerpt: articleData.excerpt,
                content: articleData.content,
                image: articleData.image,
                category: category._id,
                author: author._id,
                status: articleData.status || 'published',
                publishedAt: articleData.publishedAt || new Date(),
                tags: articleData.tags || [],
                // Add metadata to identify Telegram source
                source: 'telegram',
                metadata: {
                    telegramSource: true,
                    importedAt: new Date()
                }
            });

            const savedArticle = await article.save();
            
            console.log(`📄 Article created with ID: ${savedArticle._id}`);
            
            return savedArticle;

        } catch (error) {
            console.error('Error creating article via DB:', error);
            throw error;
        }
    }

    async createArticleAPI(articleData) {
        try {
            // First get the category ID
            const categoryResponse = await axios.get(
                `${this.baseURL}/categories?slug=${articleData.categorySlug}`
            );
            
            if (!categoryResponse.data.data || categoryResponse.data.data.length === 0) {
                throw new Error(`Category with slug '${articleData.categorySlug}' not found`);
            }
            
            const category = categoryResponse.data.data[0];

            // Prepare article payload
            const payload = {
                title: articleData.title,
                excerpt: articleData.excerpt,
                content: articleData.content,
                image: articleData.image,
                category: category._id,
                author: this.defaultAuthorId, // You'll need to set this
                status: articleData.status || 'published',
                publishedAt: articleData.publishedAt || new Date(),
                tags: articleData.tags || []
            };

            // Create article via API
            const response = await axios.post(`${this.baseURL}/articles`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication header if required
                    // 'Authorization': `Bearer ${this.authToken}`
                }
            });

            console.log(`📄 Article created via API: ${response.data.data.article._id}`);
            
            return response.data.data.article;

        } catch (error) {
            console.error('Error creating article via API:', error);
            if (error.response) {
                console.error('API Error:', error.response.data);
            }
            throw error;
        }
    }

    async getOrCreateSystemUser() {
        try {
            // Try to find existing system user
            let systemUser = await User.findOne({ 
                email: 'telegram@gmail.com' 
            });

            if (!systemUser) {
                console.log('📝 Creating system user for Telegram imports...');
                
                systemUser = new User({
                    name: 'Telegram Bot',
                    email: 'telegram@gmail.com', // Valid email format
                    password: 'system_generated_' + Date.now(), // Random password
                    role: 'editor',
                    isVerified: true,
                    bio: 'Automated system user for Telegram channel imports',
                    isSystemUser: true
                });

                await systemUser.save();
                console.log('✅ System user created');
            }

            return systemUser;

        } catch (error) {
            console.error('Error creating system user:', error);
            throw error;
        }
    }

    // Utility method to get categories
    async getCategories() {
        try {
            if (this.useDirectDB) {
                return await Category.find({ isActive: true }).select('name slug _id');
            } else {
                const response = await axios.get(`${this.baseURL}/categories`);
                return response.data.data;
            }
        } catch (error) {
            console.error('Error getting categories:', error);
            throw error;
        }
    }

    // Utility method to validate category exists
    async validateCategory(categorySlug) {
        try {
            if (this.useDirectDB) {
                const category = await Category.findOne({ 
                    slug: categorySlug, 
                    isActive: true 
                });
                return !!category;
            } else {
                const response = await axios.get(
                    `${this.baseURL}/categories?slug=${categorySlug}`
                );
                return response.data.data && response.data.data.length > 0;
            }
        } catch (error) {
            console.error('Error validating category:', error);
            return false;
        }
    }
}

module.exports = ArticleService; 