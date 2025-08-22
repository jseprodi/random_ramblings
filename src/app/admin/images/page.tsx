'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ImageInfo } from '@/lib/images';
import { searchImages, SearchFilters, SearchResult } from '@/lib/search';
import SearchBar from '@/components/SearchBar';

export default function AdminImages() {
  const [allImages, setAllImages] = useState<ImageInfo[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult<ImageInfo>>({
    items: [],
    total: 0,
    filters: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState({
    alt: '',
    description: ''
  });
  const [editingImage, setEditingImage] = useState<ImageInfo | null>(null);
  const [editForm, setEditForm] = useState({
    alt: '',
    description: ''
  });

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('/api/images');
      if (response.ok) {
        const imageList = await response.json();
        setAllImages(imageList);
        setSearchResult({
          items: imageList,
          total: imageList.length,
          filters: {}
        });
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    const result = searchImages(allImages, filters);
    setSearchResult(result);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('alt', uploadForm.alt);
      formData.append('description', uploadForm.description);

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newImage = await response.json();
        const updatedImages = [newImage, ...allImages];
        setAllImages(updatedImages);
        
        // Re-run search with current filters
        const result = searchImages(updatedImages, searchResult.filters);
        setSearchResult(result);
        
        setSelectedFile(null);
        setUploadForm({ alt: '', description: '' });
        alert('Image uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image: ImageInfo) => {
    setEditingImage(image);
    setEditForm({
      alt: image.alt || '',
      description: image.description || ''
    });
  };

  const handleEditSave = async () => {
    if (!editingImage) return;

    try {
      const response = await fetch(`/api/images/${editingImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedImages = allImages.map(img => 
          img.id === editingImage.id 
            ? { ...img, alt: editForm.alt, description: editForm.description }
            : img
        );
        setAllImages(updatedImages);
        
        // Re-run search with current filters
        const result = searchImages(updatedImages, searchResult.filters);
        setSearchResult(result);
        
        setEditingImage(null);
        alert('Image updated successfully!');
      } else {
        alert('Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Update failed');
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedImages = allImages.filter(img => img.id !== imageId);
        setAllImages(updatedImages);
        
        // Re-run search with current filters
        const result = searchImages(updatedImages, searchResult.filters);
        setSearchResult(result);
        
        alert('Image deleted successfully!');
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Delete failed');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Images</h1>
          <p className="text-gray-600">Upload and manage blog images</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Image</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                  Select Image
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Supported formats: JPEG, PNG, GIF, WebP, SVG. Max size: 10MB
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="alt" className="block text-sm font-medium text-gray-700">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    id="alt"
                    value={uploadForm.alt}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, alt: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    placeholder="Description for accessibility"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search images by name, alt text, or description..."
            showAdvanced={true}
            className="mb-4"
          />
          
          {/* Search Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {searchResult.items.length} of {searchResult.total} images
              {searchResult.filters.query && ` matching "${searchResult.filters.query}"`}
            </span>
            {searchResult.suggestions && searchResult.suggestions.length > 0 && (
              <div className="flex items-center space-x-2">
                <span>Suggestions:</span>
                {searchResult.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch({ ...searchResult.filters, query: suggestion })}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Images</h3>
            
            {searchResult.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <span className="text-4xl">🖼️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                <p className="text-gray-500">
                  {searchResult.filters.query ? 'Try adjusting your search terms.' : 'Upload your first image to get started!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResult.items.map((image) => (
                  <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Image Preview */}
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.alt || image.originalName}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    
                    {/* Image Info */}
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-900 truncate mb-2">
                        {image.originalName}
                      </h4>
                      
                      <div className="space-y-2 text-xs text-gray-500">
                        <p>Size: {formatFileSize(image.size)}</p>
                        <p>Type: {image.mimeType}</p>
                        <p>Uploaded: {formatDate(image.uploadedAt)}</p>
                        {image.alt && <p>Alt: {image.alt}</p>}
                        {image.description && <p>Description: {image.description}</p>}
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(image)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(image.url)}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                          title="Copy URL"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editingImage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Image</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-alt" className="block text-sm font-medium text-gray-700">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      id="edit-alt"
                      value={editForm.alt}
                      onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      id="edit-description"
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingImage(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
