# 🚀 Multi-Category Telegram Bot Setup Instructions

## 📋 Prerequisites

1. **OpenAI API Key** - Required for AI enhancement
2. **Telegram API Credentials** - For connecting to channels
3. **Database Connection** - MongoDB for storing articles

## 🔧 Environment Setup

Create or update your `.env` file:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Telegram Configuration  
TELEGRAM_API_ID=your_telegram_api_id
TELEGRAM_API_HASH=your_telegram_api_hash
TELEGRAM_SESSION_STRING=your_telegram_session_string

# Database Configuration
MONGODB_URI=your_mongodb_connection_string
```

## 📡 Channel Mapping

The system automatically monitors these channels:

| Category | Arabic | Channel(s) |
|----------|--------|------------|
| World | عالم | `AlarabyTelevision` |
| Politics | سياسة | `deep123321123` |
| Economy | اقتصاد | `CNNBusinessAr`, `CNNBusiness` |
| Sports | رياضة | `beINSPORTS` |
| Art | فن | `muraselonDrama` |

## 🚀 Starting the System

### Option 1: Direct Run
```bash
cd backend/telegram
node telegramBot.js
```

### Option 2: Real Listener (Recommended)
```bash
cd backend/telegram
node real-listener.js
```

### Option 3: Background Service
```bash
cd backend/telegram
./start-telegram-bot.sh  # Linux/Mac
# or
./start-telegram-bot.bat  # Windows
```

## 🔄 Process Flow

1. **Monitor** → Bot listens to all mapped channels
2. **Filter** → Only processes posts with images
3. **Extract** → Gets text caption from Telegram post
4. **AI Enhancement** → ChatGPT rewrites as professional article
5. **Publish** → Article appears in correct category section

## 🤖 AI Enhancement Features

- **Specialized Prompts** for each category
- **Professional Arabic Content** (400-600 words)
- **Automatic Author Generation** (Arabic names)
- **SEO-optimized Tags** extraction
- **Fallback Content** if AI fails

## 📊 Testing

Test the system with:
```bash
node test-all-categories.js
```

## 🔍 Monitoring

The system logs will show:
- ✅ Successful article creation
- 🤖 AI enhancement status
- 📡 Channel monitoring status
- ❌ Error handling

## 📝 Notes

- **Only posts with images** are processed
- **AI enhancement** requires OpenAI API key
- **Fallback mode** works without AI
- **Real-time updates** via WebSocket to frontend
- **Automatic categorization** based on source channel

## 🛠️ Troubleshooting

- **OpenAI Disabled**: System uses fallback content
- **Database Error**: Articles saved to files as backup
- **Channel Access**: Ensure bot has access to all channels
- **Session Issues**: Re-authenticate Telegram session

## 🎯 Ready to Launch!

Your multi-category news system is now ready to automatically:
- Monitor 5+ Telegram channels
- Generate AI-enhanced articles
- Publish to correct Arabic categories
- Update your website in real-time

Start with: `node real-listener.js` 