'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'JS Blog',
    siteDescription: 'A modern blog built with Next.js',
    adminEmail: 'admin@example.com',
    commentsEnabled: true,
    moderationRequired: true,
    maxCommentsPerPost: 100
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (_error: unknown) {
      setMessage('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your blog settings and preferences</p>
        </div>

        {/* Settings Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`px-4 py-3 rounded-md ${
                  message.includes('Error') 
                    ? 'bg-red-50 border border-red-200 text-red-700' 
                    : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  {message}
                </div>
              )}

              {/* Site Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Site Settings</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      id="siteName"
                      value={settings.siteName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      id="adminEmail"
                      value={settings.adminEmail}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                    Site Description
                  </label>
                  <textarea
                    name="siteDescription"
                    id="siteDescription"
                    rows={3}
                    value={settings.siteDescription}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>

              {/* Comment Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Comment Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="commentsEnabled"
                      id="commentsEnabled"
                      checked={settings.commentsEnabled}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="commentsEnabled" className="ml-2 block text-sm text-gray-900">
                      Enable comments on blog posts
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="moderationRequired"
                      id="moderationRequired"
                      checked={settings.moderationRequired}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="moderationRequired" className="ml-2 block text-sm text-gray-900">
                      Require admin approval for comments
                    </label>
                  </div>

                  <div>
                    <label htmlFor="maxCommentsPerPost" className="block text-sm font-medium text-gray-700">
                      Maximum comments per post
                    </label>
                    <input
                      type="number"
                      name="maxCommentsPerPost"
                      id="maxCommentsPerPost"
                      min="1"
                      max="1000"
                      value={settings.maxCommentsPerPost}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Security Notice
                      </h3>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>
                          For production use, make sure to:
                        </p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Change default admin credentials</li>
                          <li>Use environment variables for sensitive data</li>
                          <li>Enable HTTPS</li>
                          <li>Regularly update dependencies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
