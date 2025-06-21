const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

// Load test config if .env issues
let testConfig = null;
try {
    testConfig = require('../test-config');
} catch (e) {
    // Fall back to env vars
}

class TelegramService {
    constructor() {
        this.client = null;
        this.apiId = parseInt(testConfig?.TELEGRAM_API_ID || process.env.TELEGRAM_API_ID);
        this.apiHash = testConfig?.TELEGRAM_API_HASH || process.env.TELEGRAM_API_HASH;
        this.sessionString = testConfig?.TELEGRAM_SESSION_STRING || process.env.TELEGRAM_SESSION_STRING || '';
        this.phoneNumber = testConfig?.PHONE_NUMBER || '+96170187891';
        
        // Clean up invalid session strings
        if (this.sessionString && this.sessionString.includes('your-session-string')) {
            this.sessionString = '';
        }
    }

    async connect() {
        try {
            console.log('🔗 Connecting to Telegram...');
            
            const session = new StringSession(this.sessionString || "");
            this.client = new TelegramClient(session, this.apiId, this.apiHash, {
                connectionRetries: 5,
            });

            await this.client.start({
                phoneNumber: async () => this.phoneNumber,
                password: async () => await input.text('🔐 Please enter your password (if you have 2FA): '),
                phoneCode: async () => await input.text('📨 Please enter the code you received: '),
                onError: (err) => console.error('❌ Error during auth:', err),
            });

            console.log('✅ Successfully connected to Telegram');
            
            // Save session string for future use
            const newSession = this.client.session.save();
            if (newSession !== this.sessionString) {
                console.log('💾 New session string generated. Add this to your .env file:');
                console.log(`TELEGRAM_SESSION_STRING=${newSession}`);
                console.log('This will prevent the need to authenticate again.');
            }

            return this.client;
            
        } catch (error) {
            console.error('❌ Error connecting to Telegram:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.disconnect();
            console.log('🔌 Disconnected from Telegram');
        }
    }

    async getDialogs() {
        if (!this.client) {
            throw new Error('Telegram client not connected');
        }
        
        return await this.client.getDialogs();
    }

    async getChannelInfo(channelId) {
        if (!this.client) {
            throw new Error('Telegram client not connected');
        }
        
        try {
            const entity = await this.client.getEntity(channelId);
            return {
                id: entity.id.toString(),
                title: entity.title,
                username: entity.username,
                participantsCount: entity.participantsCount
            };
        } catch (error) {
            console.error(`Error getting channel info for ${channelId}:`, error);
            return null;
        }
    }

    // Utility method to list all available channels/groups
    async listChannels() {
        if (!this.client) {
            throw new Error('Telegram client not connected');
        }

        console.log('\n📋 Available channels and groups:');
        console.log('================================');

        const dialogs = await this.getDialogs();
        
        for (const dialog of dialogs) {
            const entity = dialog.entity;
            if (entity.broadcast || entity.megagroup) { // Channels or supergroups
                console.log(`📺 ${entity.title}`);
                console.log(`   ID: ${entity.id}`);
                console.log(`   Username: ${entity.username ? '@' + entity.username : 'N/A'}`);
                console.log(`   Type: ${entity.broadcast ? 'Channel' : 'Supergroup'}`);
                console.log('   ---');
            }
        }
        
        console.log('Use the ID or @username in your CHANNEL_CATEGORY_MAP');
    }
}

module.exports = TelegramService; 