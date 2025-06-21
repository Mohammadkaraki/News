require('dotenv').config();
const OpenAIService = require('./services/OpenAIService');
const UserService = require('./services/UserService');
const ArticleService = require('./services/ArticleService');

console.log('🤖 Testing AI-Enhanced Telegram Article Creation');
console.log('===============================================');

async function testAIIntegration() {
    try {
        // Test sample Telegram message
        const sampleTelegramMessage = "🏆 Breaking: Manchester United defeats Barcelona 3-1 in Champions League semifinal! Rashford scores hat-trick in stunning performance at Old Trafford. Fans celebrate historic victory! #MUFC #ChampionsLeague #Football";

        console.log('📝 Original Telegram Message:');
        console.log(`"${sampleTelegramMessage}"`);
        console.log('');

        // Test OpenAI Service
        console.log('🤖 Testing OpenAI Enhancement...');
        const openaiService = new OpenAIService();
        
        if (!openaiService.enabled) {
            console.log('⚠️  OpenAI is disabled, testing fallback content...');
        }

        const enhancedContent = await openaiService.enhanceArticleContent(sampleTelegramMessage, 'sports');
        
        console.log('✅ Enhanced Content:');
        console.log(`📰 Title: "${enhancedContent.title}"`);
        console.log(`👤 Author: ${enhancedContent.authorName}`);
        console.log(`📄 Excerpt: "${enhancedContent.excerpt}"`);
        console.log(`🏷️  Tags: ${enhancedContent.tags.join(', ')}`);
        console.log(`📝 Content Length: ${enhancedContent.content.length} characters`);
        console.log('');

        // Test User Service
        console.log('👤 Testing User Service...');
        const userService = new UserService();
        const author = await userService.getOrCreateAuthor(enhancedContent.authorName);
        console.log(`✅ Author created/found: ${author.name} (${author.email})`);
        console.log('');

        // Test Article Service (simulation)
        console.log('📄 Testing Article Creation Simulation...');
        const telegramData = {
            caption: sampleTelegramMessage,
            image: {
                url: '/uploads/test_image.jpg',
                alt: 'Test Sports Image',
                caption: sampleTelegramMessage
            },
            categorySlug: 'sports'
        };

        const articleService = new ArticleService();
        
        // Don't actually create the article, just test the enhancement
        console.log('🤖 Simulating AI enhancement process...');
        const categorySlug = telegramData.categorySlug || 'sports';
        const testEnhancement = await articleService.openaiService.enhanceArticleContent(
            telegramData.caption, 
            categorySlug
        );

        console.log('✅ Article Enhancement Test Results:');
        console.log(`   Title: "${testEnhancement.title}"`);
        console.log(`   Author: ${testEnhancement.authorName}`);
        console.log(`   Content Preview: "${testEnhancement.content.substring(0, 100)}..."`);
        console.log(`   Tags: [${testEnhancement.tags.join(', ')}]`);
        console.log('');

        console.log('🎉 All AI Integration Tests Passed!');
        console.log('');
        console.log('🚀 Ready to run enhanced Telegram bot!');
        console.log('   Run: node telegram/real-listener.js');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
        
        if (error.message.includes('OpenAI')) {
            console.log('');
            console.log('💡 Possible solutions:');
            console.log('   1. Check your OpenAI API key in .env file');
            console.log('   2. Verify internet connection');
            console.log('   3. Check OpenAI API status');
        }
    }
}

// Run the test
testAIIntegration(); 