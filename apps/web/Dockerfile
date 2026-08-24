FROM node:22-alpine AS builder
WORKDIR /app

# Copy the entire workspace
COPY . .

# Install dependencies
RUN npm ci

# Build Web
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

# Copy root dependencies and package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy built Web
COPY --from=builder /app/apps/web ./apps/web

# Set working directory to the Web app
WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
