# Vercel Blob Setup Guide

## Overview
This project uses Vercel Blob storage for storing blog posts and comments data. Blob storage is perfect for JSON files and provides a simple, scalable solution.

## Setup Steps

### 1. Create Vercel Blob Store
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the "Storage" tab
4. Click "Create Store"
5. Choose "Blob"
6. Select a region close to your users
7. Click "Create"

### 2. Get Environment Variables
After creating the Blob store, you'll get:
- `BLOB_READ_WRITE_TOKEN` - For read/write operations

### 3. Set Environment Variables

#### Local Development
Create a `.env.local` file in your project root:
```bash
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

#### Vercel Deployment
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the Blob environment variable

### 4. Initialize Database
Once deployed, visit `/api/init` to seed the database with initial data.

## How It Works

### Storage Structure
- **Posts**: Stored in `data/posts.json`
- **Comments**: Stored in `data/comments.json`

### Data Flow
1. **Read Operations**: Data is served via `/api/data/posts` and `/api/data/comments`
2. **Write Operations**: Data is uploaded to Blob storage using `@vercel/blob`
3. **Public Access**: Files are stored with public access for fast retrieval

## Benefits

- **✅ Works on Vercel** - No file system limitations
- **✅ Scalable** - Handles large amounts of data
- **✅ Fast** - Global CDN distribution
- **✅ Simple** - JSON-based storage
- **✅ Cost-effective** - Pay only for what you use

## API Endpoints

- `POST /api/posts` - Create new post
- `GET /api/posts/[slug]` - Get single post
- `PUT /api/posts/[slug]` - Update post
- `DELETE /api/posts/[slug]` - Delete post
- `GET /api/data/posts` - Get all posts data
- `GET /api/data/comments` - Get all comments data
- `POST /api/init` - Initialize database

## Testing

1. Set up environment variables
2. Run `npm run build` to ensure compilation
3. Run `npm run dev` for local development
4. Visit `/api/init` to seed database
5. Test CRUD operations through admin panel

## Troubleshooting

### "Missing environment variables" error
- Ensure `.env.local` exists with `BLOB_READ_WRITE_TOKEN`
- Check Vercel environment variables are set

### Build errors
- Run `npm run build` to check for TypeScript errors
- Ensure all async functions are properly awaited

### Blob storage issues
- Verify `BLOB_READ_WRITE_TOKEN` is correct
- Check Vercel Blob dashboard for store status
- Ensure store is in the same region as your deployment

## Migration Notes

- All file system operations replaced with Blob storage
- Functions are now async
- Pages updated to handle async data fetching
- Type safety improved with proper TypeScript interfaces
- Data served via API endpoints for better performance
