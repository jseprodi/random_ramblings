import AdminLayout from '@/components/admin/AdminLayout';
import { getSortedPostsData } from '@/lib/blog';
import { getAvailableTags, getAvailableAuthors } from '@/lib/search';
import SearchablePostsTable from '@/components/admin/SearchablePostsTable';

export default function AdminPosts() {
  const posts = getSortedPostsData();
  const availableTags = getAvailableTags(posts);
  const availableAuthors = getAvailableAuthors(posts);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Posts</h1>
          <p className="text-gray-600">Create, edit, and organize your blog posts</p>
        </div>

        {/* Searchable Posts Table */}
        <SearchablePostsTable 
          posts={posts}
          availableTags={availableTags}
          availableAuthors={availableAuthors}
        />
      </div>
    </AdminLayout>
  );
}
