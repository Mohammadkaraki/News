const fs = require('fs-extra');
const path = require('path');
const ArticleService = require('./ArticleService');
const FileArticleService = require('./FileArticleService');

class HybridArticleService {
    constructor() {
        this.dbService = new ArticleService();
        this.fileService = new FileArticleService();
        this.enhancedArticlesDir = path.join(__dirname, '../enhanced-articles');
        fs.ensureDirSync(this.enhancedArticlesDir);
    }

    async createArticleFromTelegram(telegramData) {
        let enhancedContent = null;
        
        try {
            console.log('🤖 Processing Telegram message with AI enhancement...');
            
            // STEP 1: Always get ChatGPT enhancement first
            const categorySlug = telegramData.categorySlug || 'sports';
            enhancedContent = await this.dbService.openaiService.enhanceArticleContent(
                telegramData.caption, 
                categorySlug
            );

            console.log(`✅ ChatGPT enhanced content: "${enhancedContent.title}"`);

            // STEP 2: Try database first (with short timeout)
            try {
                console.log('💾 Attempting database save...');
                
                const articleData = {
                    title: enhancedContent.title,
                    excerpt: enhancedContent.excerpt,
                    content: enhancedContent.content,
                    image: telegramData.image,
                    categorySlug: categorySlug,
                    status: 'published',
                    publishedAt: new Date(),
                    tags: enhancedContent.tags,
                    skipAuthorLookup: true
                };

                // Try DB with 10-second timeout
                const dbResult = await Promise.race([
                    this.dbService.createArticleDirectDB(articleData),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('DB timeout')), 10000))
                ]);

                console.log(`🎉 SUCCESS! Enhanced article saved to database: ${dbResult._id}`);
                return dbResult;

            } catch (dbError) {
                console.warn('⚠️  Database save failed, saving to file instead...');
                
                // STEP 3: Save enhanced content to file as backup
                const fileResult = await this.saveEnhancedToFile(enhancedContent, telegramData);
                console.log('📁 Enhanced article saved to file successfully!');
                return fileResult;
            }

        } catch (error) {
            console.error('❌ AI enhancement failed:', error.message);
            
            // STEP 4: Final fallback - basic file save
            return await this.fileService.createArticle({
                title: telegramData.caption.substring(0, 100),
                excerpt: telegramData.caption.substring(0, 200),
                content: telegramData.caption,
                image: telegramData.image,
                categorySlug: telegramData.categorySlug || 'sports',
                status: 'published',
                publishedAt: new Date(),
                tags: []
            });
        }
    }

    async saveEnhancedToFile(enhancedContent, telegramData) {
        const timestamp = Date.now();
        const filename = `enhanced_article_${timestamp}.json`;
        const filepath = path.join(this.enhancedArticlesDir, filename);

        const articleData = {
            id: timestamp,
            title: enhancedContent.title,
            excerpt: enhancedContent.excerpt,
            content: enhancedContent.content,
            image: telegramData.image,
            author: enhancedContent.authorName,
            category: telegramData.categorySlug || 'sports',
            tags: enhancedContent.tags,
            publishedAt: new Date().toISOString(),
            source: 'telegram_ai_enhanced',
            status: 'published'
        };

        await fs.writeJSON(filepath, articleData, { spaces: 2 });
        
        console.log(`📁 Enhanced article saved to: ${filepath}`);
        console.log(`📰 Title: "${enhancedContent.title}"`);
        console.log(`👤 Author: ${enhancedContent.authorName}`);
        console.log(`📝 Content: ${enhancedContent.content.length} characters`);

        return articleData;
    }

    // Method to later import file articles to database when it's working
    async importFileArticlesToDB() {
        try {
            const files = await fs.readdir(this.enhancedArticlesDir);
            const jsonFiles = files.filter(f => f.endsWith('.json'));
            
            console.log(`📂 Found ${jsonFiles.length} enhanced articles to import...`);
            
            for (const file of jsonFiles) {
                const filepath = path.join(this.enhancedArticlesDir, file);
                const articleData = await fs.readJSON(filepath);
                
                try {
                    await this.dbService.createArticleDirectDB(articleData);
                    await fs.remove(filepath); // Remove after successful import
                    console.log(`✅ Imported: ${articleData.title}`);
                } catch (error) {
                    console.error(`❌ Failed to import ${file}:`, error.message);
                }
            }
            
        } catch (error) {
            console.error('❌ Import failed:', error.message);
        }
    }
}

module.exports = HybridArticleService; 