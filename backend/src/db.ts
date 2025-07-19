/**
 * db.ts
 * -----------
 * Initializes and exports a single instance of PrismaClient
 * to be reused throughout the backend to manage database access.
 * This follows the singleton pattern to avoid multiple DB connections.
 */

import { PrismaClient } from '@prisma/client';

// Create a new instance of PrismaClient for DB operations.
// This connects to the database using the connection string in `.env` (DATABASE_URL).
const prisma = new PrismaClient();

/**
 * Tests the database connection by executing a basic query.
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected successfully.');
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); // Exit the app if DB connection fails
  }
};

// Export the same instance of PrismaClient across the entire app.
// Prevents exhausting DB connection limits by reusing the client (singleton pattern).
export default prisma;
