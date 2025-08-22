'use client';

import { useState, useEffect } from 'react';
import { ImageInfo } from '@/lib/images';

interface ImagePickerProps {
  onImageSelect: (imageUrl: string, altText: string) => void;
  onClose: () => void;
}

export default function ImagePicker({ onImageSelect, onClose }: ImagePickerProps) {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('/api/images');
      if (response.ok) {
        const imageList = await response.json();
        setImages(imageList);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages = images.filter(image =>
    image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.alt && image.alt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImageSelect = (image: ImageInfo) => {
    setSelectedImage(image);
  };

  const handleInsert = () => {
    if (selectedImage) {
      onImageSelect(selectedImage.url, selectedImage.alt || selectedImage.originalName);
      onClose();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Select Image</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            />
          </div>

          {/* Images Grid */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading images...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <span className="text-4xl">🖼️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Upload some images to get started!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-colors ${
                      selectedImage?.id === image.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    {/* Image Preview */}
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.alt || image.originalName}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    
                    {/* Image Info */}
                    <div className="p-2">
                      <h4 className="text-xs font-medium text-gray-900 truncate mb-1">
                        {image.originalName}
                      </h4>
                      <div className="text-xs text-gray-500">
                        <p>{formatFileSize(image.size)}</p>
                        {image.alt && <p className="truncate">Alt: {image.alt}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!selectedImage}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
          </div>

          {/* Selected Image Info */}
          {selectedImage && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Selected Image:</h4>
              <div className="text-sm text-blue-800">
                <p><strong>Name:</strong> {selectedImage.originalName}</p>
                <p><strong>Size:</strong> {formatFileSize(selectedImage.size)}</p>
                {selectedImage.alt && <p><strong>Alt Text:</strong> {selectedImage.alt}</p>}
                {selectedImage.description && <p><strong>Description:</strong> {selectedImage.description}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
