# ---------- Base Stage ----------
FROM node:20-alpine AS base

WORKDIR /app

# Set environment variable defaults
ENV NODE_ENV=production

# Install Prisma CLI globally (if needed in both dev/prod)
RUN npm install -g prisma

# Copy package files first to leverage caching
COPY package*.json ./

# ---------- Development Stage ----------
FROM base AS development

ENV NODE_ENV=development

# Install all dependencies including dev
RUN npm install

# Copy the full source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose dev port
EXPOSE 5000

# Start in dev mode
CMD ["npm", "run", "dev"]


# ---------- Production Build Stage ----------
FROM base AS deps

# Install only production dependencies
RUN npm ci --omit=dev

# ---------- Production Runtime Stage ----------
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy runtime deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source files and Prisma schema
COPY . .

# Generate Prisma client for production
RUN npx prisma generate

EXPOSE 5000

# Start production server
CMD ["npm", "start"]
