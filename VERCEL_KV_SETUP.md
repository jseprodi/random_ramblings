# Vercel KV Setup Guide

## Overview
This project has been migrated from file-based storage to Vercel KV (Redis) for better scalability and serverless compatibility.

## Setup Steps

### 1. Create Vercel KV Database
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the "Storage" tab
4. Click "Create Database"
5. Choose "KV" (Redis)
6. Select a region close to your users
7. Click "Create"

### 2. Get Environment Variables
After creating the KV database, you'll get:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### 3. Set Environment Variables

#### Local Development
Create a `.env.local` file in your project root:
```bash
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
```

#### Vercel Deployment
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the KV environment variables

### 4. Initialize Database
Once deployed, visit `/api/init` to seed the database with initial data.

## What Changed

### Before (File System)
- Blog posts stored as `.md` files
- File system operations (create, read, update, delete)
- **Problem**: File system is read-only on Vercel

### After (Vercel KV)
- Blog posts stored in Redis database
- Database operations via Vercel KV
- **Benefits**: 
  - Works on Vercel
  - Scalable
  - Fast performance
  - Real-time updates

## Database Schema

### Posts
```typescript
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  status: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### Comments
```typescript
interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  ipAddress?: string;
}
```

## API Endpoints

- `POST /api/posts` - Create new post
- `GET /api/posts/[slug]` - Get single post
- `PUT /api/posts/[slug]` - Update post
- `DELETE /api/posts/[slug]` - Delete post
- `POST /api/init` - Initialize database

## Migration Notes

- All file system operations replaced with database operations
- Functions are now async
- Pages updated to handle async data fetching
- Type safety improved with proper TypeScript interfaces

## Testing

1. Set up environment variables
2. Run `npm run build` to ensure compilation
3. Run `npm run dev` for local development
4. Visit `/api/init` to seed database
5. Test CRUD operations through admin panel

## Troubleshooting

### "Missing environment variables" error
- Ensure `.env.local` exists with correct values
- Check Vercel environment variables are set

### Build errors
- Run `npm run build` to check for TypeScript errors
- Ensure all async functions are properly awaited

### Database connection issues
- Verify KV_REST_API_URL and KV_REST_API_TOKEN are correct
- Check Vercel KV dashboard for database status
