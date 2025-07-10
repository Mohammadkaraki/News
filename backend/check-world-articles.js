const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const Article = require('./models/Article');
const Category = require('./models/Category');

async function checkWorldArticles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');
    
    // Get world category
    const worldCategory = await Category.findOne({ slug: 'world' });
    if (!worldCategory) {
      console.log('❌ World category not found');
      return;
    }
    
    // Get articles from world category
    const worldArticles = await Article.find({ 
      category: worldCategory._id 
    }).sort({ createdAt: -1 }).limit(10);
    
    console.log('\n🌍 Recent articles in عالم (World) category:');
    console.log('='.repeat(50));
    
    if (worldArticles.length === 0) {
      console.log('No articles found in world category');
      return;
    }
    
    worldArticles.forEach((article, index) => {
      console.log(`${index + 1}. "${article.title}"`);
      console.log(`   Created: ${article.createdAt}`);
      console.log(`   Source: ${article.source || 'manual'}`);
      console.log('   ---');
    });
    
    console.log(`\n📊 Total articles in عالم category: ${worldArticles.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkWorldArticles(); 