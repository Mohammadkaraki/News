const mongoose = require('mongoose');
const Category = require('./models/Category');

async function checkCategories() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-db');
        console.log('✅ Connected to database');
        
        // Get all categories
        const categories = await Category.find({});
        console.log('\n📋 All categories in database:');
        console.log('================================');
        
        if (categories.length === 0) {
            console.log('❌ No categories found in database!');
        } else {
            categories.forEach((cat, index) => {
                console.log(`${index + 1}. Name: "${cat.name}"`);
                console.log(`   Slug: "${cat.slug}"`);
                console.log(`   Active: ${cat.isActive}`);
                console.log(`   ID: ${cat._id}`);
                console.log('   ---');
            });
        }
        
        // Specifically check for sport-related categories
        console.log('\n🔍 Looking for sport-related categories:');
        const sportCategories = await Category.find({
            $or: [
                { slug: 'sport' },
                { slug: 'sports' },
                { name: /sport/i },
                { name: /Sport/i }
            ]
        });
        
        if (sportCategories.length > 0) {
            console.log('✅ Found sport-related categories:');
            sportCategories.forEach(cat => {
                console.log(`- "${cat.name}" (slug: "${cat.slug}", active: ${cat.isActive})`);
            });
        } else {
            console.log('❌ No sport-related categories found');
        }
        
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkCategories(); 