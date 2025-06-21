const fs = require('fs-extra');
const path = require('path');

class FileArticleService {
    constructor() {
        this.articlesFile = path.join(__dirname, '../data/articles.json');
        this.ensureDataDir();
    }

    async ensureDataDir() {
        const dataDir = path.dirname(this.articlesFile);
        await fs.ensureDir(dataDir);
        
        // Create empty articles file if it doesn't exist
        if (!await fs.pathExists(this.articlesFile)) {
            await fs.writeJson(this.articlesFile, []);
        }
    }

    async createArticle(articleData) {
        try {
            // Generate unique ID
            const id = Date.now().toString();
            
            // Create article object
            const article = {
                _id: id,
                title: articleData.title,
                excerpt: articleData.excerpt,
                content: articleData.content,
                image: articleData.image,
                categorySlug: articleData.categorySlug,
                status: articleData.status || 'published',
                publishedAt: articleData.publishedAt || new Date(),
                tags: articleData.tags || [],
                source: 'telegram',
                createdAt: new Date()
            };

            // Read existing articles
            const articles = await fs.readJson(this.articlesFile);
            
            // Add new article
            articles.push(article);
            
            // Save back to file
            await fs.writeJson(this.articlesFile, articles, { spaces: 2 });
            
            console.log(`📄 Article saved to file: ${this.articlesFile}`);
            console.log(`🆔 Article ID: ${article._id}`);
            
            return article;

        } catch (error) {
            console.error('Error saving article to file:', error);
            throw error;
        }
    }

    async getArticles() {
        try {
            const articles = await fs.readJson(this.articlesFile);
            return articles;
        } catch (error) {
            console.error('Error reading articles:', error);
            return [];
        }
    }
}

module.exports = FileArticleService; 