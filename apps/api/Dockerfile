FROM node:22-alpine AS builder
WORKDIR /app

# Copy the entire workspace
COPY . .

# Install dependencies
RUN npm ci

# Generate Prisma client and build API
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

# Copy root dependencies and package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy built API
COPY --from=builder /app/apps/api ./apps/api

# Set working directory to the API app
WORKDIR /app/apps/api

EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start:prod"]
