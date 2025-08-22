import { NextRequest, NextResponse } from 'next/server';
import { updateCommentStatus, deleteComment } from '@/lib/comments';

// PUT: Update comment status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const success = updateCommentStatus(id, status);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment status updated successfully'
    });

  } catch (error) {
    console.error('Error updating comment status:', error);
    return NextResponse.json(
      { error: 'Failed to update comment status' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteComment(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
