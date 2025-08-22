// Client-side authentication utilities
export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

// Client-side authentication check
export async function checkAuthStatus(): Promise<AdminUser | null> {
  try {
    const response = await fetch('/api/admin/me');
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// Client-side logout
export async function logout(): Promise<boolean> {
  try {
    // Clear sessionStorage
    sessionStorage.removeItem('adminUser');
    
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
    });
    return response.ok;
  } catch (error) {
    console.error('Logout failed:', error);
    // Still clear sessionStorage even if server request fails
    sessionStorage.removeItem('adminUser');
    return false;
  }
}
