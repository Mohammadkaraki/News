// Test configuration for Telegram integration
// This bypasses .env file issues for testing

module.exports = {
    TELEGRAM_API_ID: 28950354,
    TELEGRAM_API_HASH: 'a5044c66c602c331c0e39cc6f7068d78',
    TELEGRAM_SESSION_STRING: '1BAAOMTQ5LjE1NC4xNjcuOTEAUAO9D87vT9/o5SBCRbBMlX80zC0oQSVdhpCAVKbjGg70cbhxtI2e2sSFdnrwIMvZvBRUFeTYiPw7Gmul79XKiF+kVA3LykFns0lfde3iXD1VQavlubFcMkvHkixk4O8MzkuHcFeSKWw/E4CFHHySAAH02Vzt8RVgM+SdMXuKcC6hGY+48nmLP9JNcmBtrIrBZ+Ci72DPfVg03ZyfO7E6ZjU1MOF3rUMb+toz/QLif7imNMm2lg1WLV3FBTUUjVKaDwtSKrNgF/UaRbo1SXWbvjEJ28TxyYT7B5hEEMWB4SxWhbljVvQMMfIPrmcTXiUATYUySIttglXLGkMXEHlst0c=', // Empty - will need fresh authentication
    PHONE_NUMBER: '+96170187891',
    MONGODB_URI: 'mongodb://127.0.0.1:27017/news-db',
    USE_DIRECT_DB: true, // Use MongoDB database
    
    // Correct channel mapping
    CHANNEL_CATEGORY_MAP: {
        '2884922529': 'sport'  // Deep123321 channel -> sport category
    }
}; 