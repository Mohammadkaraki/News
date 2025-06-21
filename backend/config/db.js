const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 Mongoose disconnected from MongoDB');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔌 Mongoose connection disconnected through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing mongoose connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    
    // Log additional connection details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Connection details:', {
        uri: process.env.MONGODB_URI ? 'URI provided' : 'URI missing',
        error: error.message
      });
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed');
  } catch (error) {
    console.error(`❌ Error disconnecting from MongoDB: ${error.message}`);
  }
};

/**
 * Check if MongoDB is connected
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database connection info
 */
const getConnectionInfo = () => {
  const connection = mongoose.connection;
  return {
    readyState: connection.readyState,
    host: connection.host,
    port: connection.port,
    name: connection.name,
    collections: Object.keys(connection.collections)
  };
};

module.exports = {
  connectDB,
  disconnectDB,
  isConnected,
  getConnectionInfo
}; 