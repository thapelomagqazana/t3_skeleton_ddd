import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${process.env.VITE_PORT || 8080}`,// Vite frontend
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    env: {
      apiUrl: process.env.VITE_API_URL || 'http://localhost:5000/api/v1', // Express/Prisma backend
      APP_NAME: process.env.VITE_APP_NAME || 'T3 Skeleton Frontend',
    },
  },
});
