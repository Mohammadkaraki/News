const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');

// Import models directly (since we're in the same project)
const Article = require('../../models/Article');
const Category = require('../../models/Category');
const User = require('../../models/User');
const OpenAIService = require('./OpenAIService');
const UserService = require('./UserService');

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
        
        // Initialize AI and User services
        this.openaiService = new OpenAIService();
        this.userService = new UserService();
    }

    async createArticle(articleData) {
        if (this.useDirectDB) {
            return await this.createArticleDirectDB(articleData);
        } else {
            return await this.createArticleAPI(articleData);
        }
    }

    async createArticleFromTelegram(telegramData) {
        let enhancedContent = null;
        
        try {
            console.log('🤖 Processing Telegram message with AI enhancement...');
            
            // Extract category from channel mapping
            const categorySlug = telegramData.categorySlug || 'sports';
            
            // STEP 1: Always enhance content with OpenAI first
            enhancedContent = await this.openaiService.enhanceArticleContent(
                telegramData.caption, 
                categorySlug
            );

            console.log(`✅ ChatGPT enhanced content: "${enhancedContent.title}"`);

            // STEP 2: Try to get or create author (with timeout protection)
            let author = null;
            try {
                author = await Promise.race([
                    this.userService.getOrCreateAuthor(enhancedContent.authorName),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Author creation timeout')), 5000))
                ]);
            } catch (authorError) {
                console.warn('⚠️  Author creation failed, using default system user');
                author = await this.getOrCreateSystemUser();
            }

            // STEP 3: Prepare enhanced article data
            const articleData = {
                title: enhancedContent.title,
                excerpt: enhancedContent.excerpt,
                content: enhancedContent.content,
                image: telegramData.image,
                categorySlug: categorySlug,
                status: 'published',
                publishedAt: new Date(),
                tags: enhancedContent.tags,
                authorOverride: author
            };

            console.log(`📝 Creating AI-enhanced article: "${enhancedContent.title}" by ${author.name}`);
            
            return await this.createArticleDirectDB(articleData);

        } catch (error) {
            console.error('❌ Error in AI enhancement process:', error.message);
            
                         // If we have enhanced content but DB failed, try with enhanced content + no author lookup
            if (enhancedContent) {
                console.log('⚠️  Using enhanced content with direct DB save...');
                try {
                    const articleData = {
                        title: enhancedContent.title,
                        excerpt: enhancedContent.excerpt,
                        content: enhancedContent.content,
                        image: telegramData.image,
                        categorySlug: telegramData.categorySlug || 'sports',
                        status: 'published',
                        publishedAt: new Date(),
                        tags: enhancedContent.tags,
                        skipAuthorLookup: true // Skip user lookup entirely
                    };
                    
                    return await this.createArticleDirectDB(articleData);
                } catch (fallbackError) {
                    console.error('❌ Enhanced fallback failed:', fallbackError.message);
                }
            }
            
            // Final fallback to basic article creation
            console.log('⚠️  Falling back to basic article creation...');
            return await this.createBasicTelegramArticle(telegramData);
        }
    }

    async createBasicTelegramArticle(telegramData) {
        // Fallback method without AI enhancement
        const title = telegramData.caption.split(/[.!?]+/)[0].trim() || 'Sports Update';
        
        const articleData = {
            title: title.length > 100 ? title.substring(0, 97) + '...' : title,
            excerpt: telegramData.caption.substring(0, 200).trim(),
            content: `<p>${telegramData.caption}</p>`,
            image: telegramData.image,
            categorySlug: telegramData.categorySlug || 'sports',
            status: 'published',
            publishedAt: new Date(),
            tags: []
        };

        return await this.createArticleDirectDB(articleData);
    }

    async createArticleDirectDB(articleData) {
        try {
            // Ensure database connection with timeout
            if (mongoose.connection.readyState !== 1) {
                console.log('⚠️  Database not connected, attempting to connect...');
                // Set MONGODB_URI from our config if not set
                if (!process.env.MONGODB_URI && this.mongoUri) {
                    process.env.MONGODB_URI = this.mongoUri;
                }
                
                // Connect with timeout and proper configuration
                await Promise.race([
                    (async () => {
                        await mongoose.connect(process.env.MONGODB_URI, {
                            serverSelectionTimeoutMS: 5000,
                            socketTimeoutMS: 5000,
                            maxPoolSize: 10
                        });
                        console.log('✅ MongoDB Connected: 127.0.0.1');
                        console.log('📊 Database: news-db');
                    })(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Database connection timeout')), 8000))
                ]);
            }

            // Get category by slug
            const category = await Category.findOne({ 
                slug: articleData.categorySlug, 
                isActive: true 
            });
            
            if (!category) {
                throw new Error(`Category with slug '${articleData.categorySlug}' not found`);
            }

            // Get author (prioritize override, then default, then system user)
            let author = articleData.authorOverride;
            
            if (!author && !articleData.skipAuthorLookup) {
                if (this.defaultAuthorId) {
                    author = await User.findById(this.defaultAuthorId);
                }
                
                if (!author) {
                    author = await this.getOrCreateSystemUser();
                }
            }
            
            // If skipAuthorLookup is true or author still null, create a minimal author object
            if (!author) {
                console.log('⚠️  Creating minimal author for enhanced article...');
                author = {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'AI Sports Reporter',
                    email: 'ai.reporter@newssite.com'
                };
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