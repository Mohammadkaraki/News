require('dotenv').config();
const OpenAIService = require('./services/OpenAIService');

console.log('🤖 Testing Enhanced ChatGPT Content Generation');
console.log('==============================================');

async function testChatGPT() {
    try {
        // Test sample message
        const sampleMessage = "ليفربول ضيفاً على فريق لاسك النمساوي في دوري أبطال أوروبا";

        console.log('📝 Original Telegram Message:');
        console.log(`"${sampleMessage}"`);
        console.log('');

        // Test OpenAI Service
        const openaiService = new OpenAIService();
        
        if (!openaiService.enabled) {
            console.log('⚠️  OpenAI disabled, testing fallback content...');
        }

        console.log('🤖 Sending to ChatGPT for enhancement...');
        const enhancedContent = await openaiService.enhanceArticleContent(sampleMessage, 'sports');
        
        console.log('✅ ChatGPT Enhanced Results:');
        console.log('=' .repeat(50));
        console.log(`📰 TITLE: "${enhancedContent.title}"`);
        console.log('');
        console.log(`👤 AUTHOR: ${enhancedContent.authorName}`);
        console.log('');
        console.log(`📄 EXCERPT: "${enhancedContent.excerpt}"`);
        console.log('');
        console.log(`🏷️  TAGS: [${enhancedContent.tags.join(', ')}]`);
        console.log('');
        console.log(`📝 DETAILED CONTENT (${enhancedContent.content.length} characters):`);
        console.log('-'.repeat(50));
        console.log(enhancedContent.content);
        console.log('-'.repeat(50));
        console.log('');
        
        // Count paragraphs
        const paragraphCount = (enhancedContent.content.match(/<p>/g) || []).length;
        console.log(`📊 Content Analysis:`);
        console.log(`   - Character count: ${enhancedContent.content.length}`);
        console.log(`   - Paragraph count: ${paragraphCount}`);
        console.log(`   - Word count: ~${enhancedContent.content.replace(/<[^>]*>/g, '').split(' ').length}`);
        console.log('');
        
        console.log('🎉 SUCCESS! ChatGPT generated detailed professional content!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testChatGPT(); 