import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import redis from './config/redis';

// Load environment variables
dotenv.config();

/**
 * Fix: MongoDB Atlas SRV DNS Resolution Issue
 */
dns.setServers(['1.1.1.1', '8.8.8.8']);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxemarket';

mongoose.set('strictQuery', true);

const startServer = async () => {
  try {

    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ [MongoDB] Connected to ${mongoose.connection.host}`);

    const server = app.listen(PORT, () => {
      console.log(`🚀 [Server] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Graceful shutdown handler
    const shutdown = async (signal: string) => {
      console.log(`\n⚠️ ${signal} received. Closing connections...`);

      server.close(() => {
        console.log("HTTP Server closed.");
      });

      try {
        await mongoose.connection.close(false);
        console.log("MongoDB connection closed.");

        // Safe Redis shutdown (TypeScript-safe)
        if (redis && typeof (redis as any).quit === 'function') {
          await (redis as any).quit();
          console.log("Redis connection closed.");
        }

        process.exit(0);
      } catch (err) {
        console.error("❌ Error during shutdown:", err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB] Disconnected!');
    });

  } catch (error: any) {
    console.error("❌ MongoDB connection failed!");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    process.exit(1);
  }
};

startServer();
