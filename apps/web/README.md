# Prameela OneSuite - Web Client

This is the frontend application for the Prameela OneSuite company management system, built with [Next.js](https://nextjs.org/).

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui & Base UI
- **Data Fetching:** React Query (TanStack Query)
- **Language:** TypeScript

## Features

- Dynamic **Light / Dark Mode** support.
- Fully responsive design featuring a standard Table view on desktop and an optimized **Card View** on mobile devices.
- Real-time search, sorting, and pagination.
- Client-side and Server-side form validation using React Hook Form and Zod.

## Quick Start

This workspace is part of a monorepo. It's recommended to run the full application from the root directory. However, to run the Web app in isolation:

1. Ensure the backend API is running (defaults to `http://localhost:4000/api/v1`).
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL of the NestJS backend API. If not set, it defaults to `http://localhost:4000/api/v1`.

> **Note:** For full-stack setup instructions and Docker deployment, please refer to the [Root README](../../README.md).
