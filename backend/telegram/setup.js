const TelegramService = require('./services/TelegramService');
const ArticleService = require('./services/ArticleService');
require('dotenv').config();

class TelegramSetup {
    constructor() {
        this.telegramService = new TelegramService();
        this.articleService = new ArticleService();
    }

    async run() {
        console.log('🔧 Telegram Bot Setup Utility');
        console.log('=============================\n');

        try {
            // Connect to Telegram
            await this.telegramService.connect();

            // Show menu
            await this.showMenu();

        } catch (error) {
            console.error('❌ Setup failed:', error);
        }
    }

    async showMenu() {
        const input = require('input');
        
        while (true) {
            console.log('\n📋 Setup Options:');
            console.log('1. List available channels');
            console.log('2. Test category mapping');
            console.log('3. List categories in database');
            console.log('4. Create test categories');
            console.log('5. Exit');
            
            const choice = await input.text('Choose an option (1-5): ');
            
            switch (choice) {
                case '1':
                    await this.listChannels();
                    break;
                case '2':
                    await this.testCategoryMapping();
                    break;
                case '3':
                    await this.listCategories();
                    break;
                case '4':
                    await this.createTestCategories();
                    break;
                case '5':
                    console.log('👋 Goodbye!');
                    process.exit(0);
                    break;
                default:
                    console.log('❌ Invalid option');
            }
        }
    }

    async listChannels() {
        console.log('\n🔍 Fetching your channels...');
        await this.telegramService.listChannels();
    }

    async testCategoryMapping() {
        const input = require('input');
        
        console.log('\n🧪 Testing Category Mapping');
        const channelId = await input.text('Enter channel ID or @username: ');
        
        // You can modify this to test your actual mapping
        const CHANNEL_CATEGORY_MAP = {
            'deep123321123': 'sport'
        };

        const categorySlug = CHANNEL_CATEGORY_MAP[channelId] || 
                           CHANNEL_CATEGORY_MAP[channelId.replace('@', '')];
        
        if (categorySlug) {
            console.log(`✅ Channel maps to category: ${categorySlug}`);
            
            // Check if category exists
            const exists = await this.articleService.validateCategory(categorySlug);
            if (exists) {
                console.log('✅ Category exists in database');
            } else {
                console.log('❌ Category not found in database');
            }
        } else {
            console.log('❌ Channel not found in mapping');
        }
    }

    async listCategories() {
        console.log('\n📁 Categories in database:');
        try {
            const categories = await this.articleService.getCategories();
            
            if (categories.length === 0) {
                console.log('❌ No categories found');
                return;
            }

            categories.forEach(category => {
                console.log(`📂 ${category.name} (slug: ${category.slug})`);
            });
        } catch (error) {
            console.error('❌ Error fetching categories:', error);
        }
    }

    async createTestCategories() {
        console.log('\n🆕 Creating test categories...');
        
        const testCategories = [
            { name: 'Sport', slug: 'sport', description: 'Sports news and updates' },
            { name: 'Business', slug: 'business', description: 'Business and finance news' },
            { name: 'Technology', slug: 'technology', description: 'Tech news and innovations' },
            { name: 'Politics', slug: 'politics', description: 'Political news and analysis' }
        ];

        try {
            const Category = require('../models/Category');
            const User = require('../models/User');
            
            // Get or create system user
            const systemUser = await this.articleService.getOrCreateSystemUser();

            for (const catData of testCategories) {
                const existingCategory = await Category.findOne({ slug: catData.slug });
                
                if (!existingCategory) {
                    const category = new Category({
                        ...catData,
                        createdBy: systemUser._id
                    });
                    
                    await category.save();
                    console.log(`✅ Created category: ${catData.name}`);
                } else {
                    console.log(`⏭️  Category already exists: ${catData.name}`);
                }
            }
            
            console.log('✅ Test categories setup complete');
            
        } catch (error) {
            console.error('❌ Error creating categories:', error);
        }
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    const setup = new TelegramSetup();
    setup.run().catch(console.error);
}

module.exports = TelegramSetup; 