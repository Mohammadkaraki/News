const mongoose = require('mongoose');
const Category = require('./models/Category');

async function createCategories() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-db');
        console.log('✅ Connected to database');
        
        // Categories to create
        const categories = [
            {
                name: 'Sport',
                slug: 'sport',
                description: 'Sports news and updates from Telegram channels',
                isActive: true,
                featuredOrder: 1
            },
            {
                name: 'News',
                slug: 'news',
                description: 'General news and current events',
                isActive: true,
                featuredOrder: 2
            },
            {
                name: 'Technology',
                slug: 'technology',
                description: 'Tech news and innovations',
                isActive: true,
                featuredOrder: 3
            },
            {
                name: 'Entertainment',
                slug: 'entertainment',
                description: 'Entertainment news and celebrity updates',
                isActive: true,
                featuredOrder: 4
            }
        ];
        
        console.log('\n📝 Creating categories...');
        
        for (const categoryData of categories) {
            const category = await Category.findOneAndUpdate(
                { slug: categoryData.slug },
                categoryData,
                { upsert: true, new: true }
            );
            
            console.log(`✅ Created/Updated: "${category.name}" (slug: ${category.slug})`);
        }
        
        console.log('\n🎉 All categories created successfully!');
        
        // Verify the sport category specifically
        const sportCategory = await Category.findOne({ slug: 'sport' });
        if (sportCategory) {
            console.log('\n✅ Sport category verification:');
            console.log(`   Name: ${sportCategory.name}`);
            console.log(`   Slug: ${sportCategory.slug}`);
            console.log(`   Active: ${sportCategory.isActive}`);
            console.log(`   ID: ${sportCategory._id}`);
        }
        
        await mongoose.disconnect();
        console.log('\n🎯 Now your Telegram bot can create sport articles!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createCategories(); 