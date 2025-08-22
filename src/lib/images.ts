import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

// Image storage directory
const imagesDirectory = path.join(process.cwd(), 'src/content/images');

export interface ImageInfo {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  url: string;
  alt?: string;
  description?: string;
}

export interface ImageUploadData {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
  alt?: string;
  description?: string;
}

// Ensure images directory exists
function ensureImagesDirectory() {
  if (!fs.existsSync(imagesDirectory)) {
    fs.mkdirSync(imagesDirectory, { recursive: true });
  }
}

// Generate unique image ID
function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get file extension from mime type
function getExtensionFromMimeType(mimeType: string): string {
  const extensions: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
  };
  return extensions[mimeType] || 'bin';
}

// Upload and save image
export async function uploadImage(uploadData: ImageUploadData): Promise<ImageInfo> {
  ensureImagesDirectory();
  
  const imageId = generateImageId();
  const extension = getExtensionFromMimeType(uploadData.mimeType);
  const filename = `${imageId}.${extension}`;
  const filePath = path.join(imagesDirectory, filename);
  
  // Save the image file
  await writeFile(filePath, uploadData.buffer);
  
  // Create image info
  const imageInfo: ImageInfo = {
    id: imageId,
    filename,
    originalName: uploadData.originalName,
    mimeType: uploadData.mimeType,
    size: uploadData.size,
    uploadedAt: new Date().toISOString(),
    url: `/api/images/serve?file=${filename}`,
    alt: uploadData.alt,
    description: uploadData.description
  };
  
  // Save metadata to JSON file
  const metadataPath = path.join(imagesDirectory, `${imageId}.json`);
  await writeFile(metadataPath, JSON.stringify(imageInfo, null, 2));
  
  return imageInfo;
}

// Get all uploaded images
export function getAllImages(): ImageInfo[] {
  ensureImagesDirectory();
  
  const images: ImageInfo[] = [];
  const files = fs.readdirSync(imagesDirectory);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      try {
        const metadataPath = path.join(imagesDirectory, file);
        const metadata = fs.readFileSync(metadataPath, 'utf-8');
        const imageInfo = JSON.parse(metadata) as ImageInfo;
        images.push(imageInfo);
      } catch (error) {
        console.error(`Error reading image metadata for ${file}:`, error);
      }
    }
  }
  
  // Sort by upload date (newest first)
  return images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

// Get image by ID
export function getImageById(imageId: string): ImageInfo | null {
  try {
    const metadataPath = path.join(imagesDirectory, `${imageId}.json`);
    if (!fs.existsSync(metadataPath)) {
      return null;
    }
    
    const metadata = fs.readFileSync(metadataPath, 'utf-8');
    return JSON.parse(metadata) as ImageInfo;
  } catch (error) {
    console.error(`Error reading image ${imageId}:`, error);
    return null;
  }
}

// Delete image
export function deleteImage(imageId: string): boolean {
  try {
    const image = getImageById(imageId);
    if (!image) {
      return false;
    }
    
    // Delete image file
    const imagePath = path.join(imagesDirectory, image.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Delete metadata file
    const metadataPath = path.join(imagesDirectory, `${imageId}.json`);
    if (fs.existsSync(metadataPath)) {
      fs.unlinkSync(metadataPath);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting image ${imageId}:`, error);
    return false;
  }
}

// Update image metadata
export function updateImageMetadata(imageId: string, updates: Partial<Pick<ImageInfo, 'alt' | 'description'>>): boolean {
  try {
    const image = getImageById(imageId);
    if (!image) {
      return false;
    }
    
    // Update fields
    const updatedImage = { ...image, ...updates };
    
    // Save updated metadata
    const metadataPath = path.join(imagesDirectory, `${imageId}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(updatedImage, null, 2));
    
    return true;
  } catch (error) {
    console.error(`Error updating image ${imageId}:`, error);
    return false;
  }
}

// Get image statistics
export function getImageStats() {
  const images = getAllImages();
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  
  return {
    totalImages: images.length,
    totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    byType: images.reduce((acc, img) => {
      const type = img.mimeType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };
}
