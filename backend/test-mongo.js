require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...');
console.log(`📍 URI: ${process.env.MONGODB_URI}`);

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000
}).then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    process.exit(0);
}).catch(err => {
    console.log('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
}); 