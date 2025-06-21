const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

console.log('🔧 Manual Authentication Fix');
console.log('=============================');
console.log('The current session string is causing hanging.');
console.log('We need to create a NEW session string from scratch.');
console.log();

// Use the credentials
const TELEGRAM_API_ID = 28950354;
const TELEGRAM_API_HASH = 'a5044c66c602c331c0e39cc6f7068d78';
const PHONE_NUMBER = '+96170187891';

async function manualAuth() {
    try {
        console.log('📱 Starting FRESH authentication (no existing session)...');
        console.log(`Phone: ${PHONE_NUMBER}`);
        console.log();
        
        // Create client with EMPTY session
        const session = new StringSession('');
        const client = new TelegramClient(session, TELEGRAM_API_ID, TELEGRAM_API_HASH, {
            connectionRetries: 3,
            connectionTimeout: 20000,
        });

        console.log('🔗 Connecting to Telegram servers...');
        
        // Manual step-by-step authentication
        await client.connect();
        console.log('✅ Connected to servers!');
        
        // Send code request
        console.log('📨 Sending authentication code...');
        const { phoneCodeHash } = await client.sendCode(
            {
                apiId: TELEGRAM_API_ID,
                apiHash: TELEGRAM_API_HASH,
            },
            PHONE_NUMBER
        );
        
        console.log('✅ Code sent to your phone!');
        console.log();
        console.log('📱 CHECK YOUR TELEGRAM APP FOR THE CODE');
        console.log('Then run this script again and enter the code when prompted.');
        console.log();
        console.log('📋 Save this phone code hash for next step:');
        console.log(`PHONE_CODE_HASH = "${phoneCodeHash}"`);
        
        // Disconnect for now
        await client.disconnect();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('FLOOD_WAIT')) {
            console.log('⏳ Rate limited. Wait a few minutes and try again.');
        }
    }
}

manualAuth(); 