const User = require('../../models/User');

class UserService {
    constructor() {
        this.authorCache = new Map();
    }

    async getOrCreateAuthor(authorName, email = null) {
        try {
            // Check cache first
            if (this.authorCache.has(authorName)) {
                return this.authorCache.get(authorName);
            }

            // Generate email if not provided
            if (!email) {
                email = this.generateEmailFromName(authorName);
            }

            // Check if user already exists
            let user = await User.findOne({ email });

            if (!user) {
                // Create new user
                user = await User.create({
                    name: authorName,
                    email: email,
                    password: 'temp_password_' + Date.now(), // Temporary password
                    role: 'user',
                    isVerified: true,
                    isActive: true,
                    bio: `Sports journalist and contributor`,
                    source: 'telegram_generated'
                });

                console.log(`✅ Created new author: ${authorName} (${email})`);
            }

            // Cache the user
            this.authorCache.set(authorName, user);
            return user;

        } catch (error) {
            console.error('❌ Error creating/finding author:', error.message);
            
            // Fallback to default Telegram user
            return await this.getDefaultTelegramUser();
        }
    }

    async getDefaultTelegramUser() {
        try {
            let telegramUser = await User.findOne({ email: 'telegram@gmail.com' });
            
            if (!telegramUser) {
                telegramUser = await User.create({
                    name: 'News Bot',
                    email: 'telegram@gmail.com',
                    password: 'telegram_bot_password',
                    role: 'user',
                    isVerified: true,
                    isActive: true,
                    bio: 'Automated news contributor',
                    source: 'telegram_system'
                });
            }

            return telegramUser;
        } catch (error) {
            console.error('❌ Error getting default Telegram user:', error.message);
            throw error;
        }
    }

    generateEmailFromName(name) {
        // Convert name to email format
        const emailName = name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '.'); // Replace spaces with dots
        
        return `${emailName}@newscontributor.com`;
    }

    // Clear cache periodically to avoid memory leaks
    clearCache() {
        this.authorCache.clear();
        console.log('🧹 Author cache cleared');
    }
}

module.exports = UserService; 