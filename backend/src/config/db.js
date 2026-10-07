const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMockDB = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('---------------------------------------------------------');
    console.log('WARNING: Failed to connect to remote MongoDB database.');
    console.log('Starting backend in DEMO MODE with In-Memory Database fallback.');
    console.log('This allows you to test the app without a running database!');
    console.log('---------------------------------------------------------');
    global.isMockDB = true;
  }
};

module.exports = connectDB;
