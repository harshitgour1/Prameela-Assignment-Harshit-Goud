# Prameela OneSuite - Backend API

This is the backend service for the Prameela OneSuite company management application, built with [NestJS](https://nestjs.com/) and [Prisma ORM](https://www.prisma.io/).

## Tech Stack
- **Framework:** NestJS (v11)
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Language:** TypeScript

## Quick Start

This workspace is part of a monorepo. It's recommended to run the full application from the root directory. However, to run the API in isolation:

1. Create a `.env` file based on `.env.example` (or use the existing `.env`) with your `DATABASE_URL`.
2. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
3. Run the migrations to sync the database schema:
   ```bash
   npx prisma migrate deploy
   ```
4. Start the server:
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## API Endpoints (v1)
By default, the API runs on `http://localhost:4000/api/v1`.

- `POST /companies` - Create a new company
- `GET /companies` - Get all companies (supports pagination: `?page=1&limit=10`, sorting: `?sortBy=companyName&sortOrder=asc`, and search: `?search=Acme`)
- `DELETE /companies/:id` - Delete a specific company by ID

## Testing
Run the unit test suite (Jest):
```bash
npm run test
```

> **Note:** For full-stack setup instructions and Docker deployment, please refer to the [Root README](../../README.md).
