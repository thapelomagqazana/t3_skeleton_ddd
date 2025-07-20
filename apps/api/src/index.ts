/**
 * @file index.ts
 * @description Entry point of the backend server. Starts the Express application.
 */

import app from './app';
import { connectDB } from './db';

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

/**
 * The port on which the server should run.
 * Uses environment variable PORT, or defaults to 5000.
 */
const PORT: number = Number(process.env.PORT) || 5000;

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────

/**
 * Starts the Express server and listens for incoming connections.
 */
(async () => {
  await connectDB(); // Ensure DB is connected first

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
})();
