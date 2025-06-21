const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');

console.log('🔧 Quick Session Fix');
console.log('====================');

const TELEGRAM_API_ID = 28950354;
const TELEGRAM_API_HASH = 'a5044c66c602c331c0e39cc6f7068d78';
const PHONE_NUMBER = '+96170187891';

// The problematic session string
const OLD_SESSION = '1BAAOMTQ5LjE1NC4xNjcuOTEAUJZIQ5ERyDNqJn7YTsqqU8IxYVFMzBwPD7V92XLZxasUjphCZavdQGF7Gut/bXvHbElrASnXGhuUeZqvIztSTthy/hrgZ1DeRvabYrJscq/pQn/UjHWVrwKxJRwK6Rcjen4qi3XaxfSHJpEMX5Qk6XV2nEt';

console.log(`❌ Current session is corrupted/incomplete (${OLD_SESSION.length} chars)`);
console.log('✅ Creating fresh session...');

async function quickFix() {
    try {
        // Create EMPTY session client
        const session = new StringSession('');
        const client = new TelegramClient(session, TELEGRAM_API_ID, TELEGRAM_API_HASH, {
            connectionRetries: 3,
            connectionTimeout: 15000,
        });

        console.log('🔗 Connecting with empty session...');
        await client.connect();
        
        console.log('📱 Starting authentication...');
        console.log(`Using phone: ${PHONE_NUMBER}`);
        
        // Use client.start() with prompts
        await client.start({
            phoneNumber: async () => PHONE_NUMBER,
            password: async () => {
                console.log('🔐 If you have 2FA enabled, enter password:');
                return await input.text('Password (or press Enter to skip): ');
            },
            phoneCode: async () => {
                console.log('📨 Check your Telegram app for the login code');
                return await input.text('Enter the 5-digit code: ');
            },
            onError: (err) => console.log('❌ Error:', err.message),
        });

        console.log('✅ Authentication successful!');
        
        // Get and save new session
        const newSession = client.session.save();
        console.log(`\n🔑 NEW SESSION STRING (${newSession.length} chars):`);
        console.log('='.repeat(60));
        console.log(newSession);
        console.log('='.repeat(60));

        // Update test-config.js automatically
        const configPath = './test-config.js';
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Replace the session string
        const updatedConfig = configContent.replace(
            /TELEGRAM_SESSION_STRING: '[^']*'/,
            `TELEGRAM_SESSION_STRING: '${newSession}'`
        );
        
        fs.writeFileSync(configPath, updatedConfig);
        console.log('\n✅ Updated test-config.js with new session!');

        // Test the connection
        const me = await client.getMe();
        console.log(`👤 Logged in as: ${me.firstName} ${me.lastName || ''} (${me.phone})`);

        await client.disconnect();
        console.log('\n🎉 Session fix complete! You can now run real-listener.js');
        
    } catch (error) {
        console.error('❌ Fix Error:', error.message);
        if (error.message.includes('AUTH_KEY_DUPLICATED')) {
            console.log('💡 Try logging out of other Telegram sessions first');
        }
    }
}

quickFix(); 