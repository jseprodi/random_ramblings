import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename parameter is required' },
        { status: 400 }
      );
    }

    const imagesDirectory = path.join(process.cwd(), 'src/content/images');
    const imagePath = path.join(imagesDirectory, filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Determine content type from file extension
    const ext = path.extname(filename).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    }[ext] || 'application/octet-stream';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Content-Length': imageBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}
