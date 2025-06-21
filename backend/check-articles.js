const mongoose = require('mongoose');
const Article = require('./models/Article');
const Category = require('./models/Category');
const User = require('./models/User');

async function checkArticles() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-db');
        console.log('✅ Connected to database');
        
        // Get all articles
        const articles = await Article.find({})
            .populate('category', 'name slug')
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);
        
        console.log('\n📋 All Articles in Database:');
        console.log('============================');
        
        if (articles.length === 0) {
            console.log('❌ No articles found in database!');
        } else {
            articles.forEach((article, index) => {
                console.log(`\n${index + 1}. "${article.title}"`);
                console.log(`   ID: ${article._id}`);
                console.log(`   Slug: ${article.slug}`);
                console.log(`   Category: ${article.category?.name} (${article.category?.slug})`);
                console.log(`   Author: ${article.author?.name} (${article.author?.email})`);
                console.log(`   Status: ${article.status}`);
                console.log(`   Source: ${article.source || 'manual'}`);
                console.log(`   Created: ${article.createdAt}`);
                console.log(`   Published: ${article.publishedAt}`);
                console.log(`   Image: ${article.image?.url ? 'Yes' : 'No'}`);
                console.log(`   Featured: ${article.featured || false}`);
                console.log('   ---');
            });
        }
        
        // Check article counts by source
        const totalArticles = await Article.countDocuments({});
        const telegramArticles = await Article.countDocuments({ source: 'telegram' });
        const manualArticles = await Article.countDocuments({ 
            $or: [{ source: { $ne: 'telegram' } }, { source: { $exists: false } }] 
        });
        
        console.log('\n📊 Article Statistics:');
        console.log('======================');
        console.log(`Total Articles: ${totalArticles}`);
        console.log(`Telegram Articles: ${telegramArticles}`);
        console.log(`Manual Articles: ${manualArticles}`);
        
        // Check article status
        const published = await Article.countDocuments({ status: 'published' });
        const draft = await Article.countDocuments({ status: 'draft' });
        
        console.log(`Published: ${published}`);
        console.log(`Draft: ${draft}`);
        
        // Check recent Telegram articles specifically
        const recentTelegram = await Article.find({ source: 'telegram' })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .limit(3);
            
        if (recentTelegram.length > 0) {
            console.log('\n🤖 Recent Telegram Articles:');
            console.log('=============================');
            recentTelegram.forEach((article, index) => {
                console.log(`${index + 1}. "${article.title}"`);
                console.log(`   Category: ${article.category?.name}`);
                console.log(`   Content: ${article.content?.substring(0, 100)}...`);
                console.log(`   Image: ${article.image?.url}`);
            });
        }
        
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkArticles(); 