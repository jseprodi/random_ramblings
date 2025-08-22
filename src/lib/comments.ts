import fs from 'fs';
import path from 'path';

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CommentFormData {
  postSlug: string;
  author: string;
  email: string;
  content: string;
  ipAddress?: string;
  userAgent?: string;
}

const commentsDirectory = path.join(process.cwd(), 'src/content/comments');

// Ensure comments directory exists
function ensureCommentsDirectory() {
  if (!fs.existsSync(commentsDirectory)) {
    fs.mkdirSync(commentsDirectory, { recursive: true });
  }
}

// Get all comments for a specific post
export function getCommentsForPost(postSlug: string): Comment[] {
  try {
    ensureCommentsDirectory();
    const commentsFile = path.join(commentsDirectory, `${postSlug}.json`);
    
    if (!fs.existsSync(commentsFile)) {
      return [];
    }
    
    const fileContents = fs.readFileSync(commentsFile, 'utf8');
    const comments: Comment[] = JSON.parse(fileContents);
    
    // Filter to only show approved comments
    return comments.filter(comment => comment.status === 'approved');
  } catch (error) {
    console.error('Error reading comments:', error);
    return [];
  }
}

// Get all comments (for admin)
export function getAllComments(): Comment[] {
  try {
    ensureCommentsDirectory();
    const allComments: Comment[] = [];
    
    if (!fs.existsSync(commentsDirectory)) {
      return [];
    }
    
    const files = fs.readdirSync(commentsDirectory);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(commentsDirectory, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const postComments: Comment[] = JSON.parse(fileContents);
        allComments.push(...postComments);
      }
    }
    
    // Sort by creation date (newest first)
    return allComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error reading all comments:', error);
    return [];
  }
}

// Add a new comment
export function addComment(commentData: CommentFormData): Comment {
  try {
    ensureCommentsDirectory();
    const { postSlug, author, email, content, ipAddress, userAgent } = commentData;
    
    const newComment: Comment = {
      id: generateCommentId(),
      postSlug,
      author,
      email,
      content,
      status: 'pending', // All new comments start as pending
      createdAt: new Date().toISOString(),
      ipAddress,
      userAgent
    };
    
    const commentsFile = path.join(commentsDirectory, `${postSlug}.json`);
    let existingComments: Comment[] = [];
    
    if (fs.existsSync(commentsFile)) {
      const fileContents = fs.readFileSync(commentsFile, 'utf8');
      existingComments = JSON.parse(fileContents);
    }
    
    existingComments.push(newComment);
    fs.writeFileSync(commentsFile, JSON.stringify(existingComments, null, 2), 'utf8');
    
    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
}

// Update comment status (for admin)
export function updateCommentStatus(commentId: string, newStatus: Comment['status']): boolean {
  try {
    ensureCommentsDirectory();
    const files = fs.readdirSync(commentsDirectory);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(commentsDirectory, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const comments: Comment[] = JSON.parse(fileContents);
        
        const commentIndex = comments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
          comments[commentIndex].status = newStatus;
          fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), 'utf8');
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error updating comment status:', error);
    return false;
  }
}

// Delete a comment
export function deleteComment(commentId: string): boolean {
  try {
    ensureCommentsDirectory();
    const files = fs.readdirSync(commentsDirectory);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(commentsDirectory, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const comments: Comment[] = JSON.parse(fileContents);
        
        const commentIndex = comments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
          comments.splice(commentIndex, 1);
          fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), 'utf8');
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}

// Get comment statistics
export function getCommentStats() {
  try {
    const allComments = getAllComments();
    const total = allComments.length;
    const pending = allComments.filter(c => c.status === 'pending').length;
    const approved = allComments.filter(c => c.status === 'approved').length;
    const rejected = allComments.filter(c => c.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  } catch (error) {
    console.error('Error getting comment stats:', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }
}

// Generate unique comment ID
function generateCommentId(): string {
  return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
