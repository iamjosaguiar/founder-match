import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = resolvedParams.id;
    const { content, parentId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Comment is too long (max 2000 characters)' }, { status: 400 });
    }

    // Check if post exists
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      select: { id: true, isLocked: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.isLocked) {
      return NextResponse.json({ error: 'This post is locked and cannot receive new comments' }, { status: 403 });
    }

    // If parentId is provided, verify the parent comment exists and belongs to this post
    if (parentId) {
      const parentComment = await prisma.forumComment.findUnique({
        where: { id: parentId },
        select: { postId: true }
      });

      if (!parentComment || parentComment.postId !== postId) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
    }

    // Create the comment
    const comment = await prisma.forumComment.create({
      data: {
        content: content.trim(),
        authorId: (session.user as any).id,
        postId: postId,
        parentId: parentId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profileImage: true,
            title: true
          }
        }
      }
    });

    // Increment the post's comment count
    await prisma.forumPost.update({
      where: { id: postId },
      data: {
        commentsCount: {
          increment: 1
        }
      }
    });

    // Format the comment for response
    const formattedComment = {
      ...comment,
      isLiked: false,
      replies: []
    };

    return NextResponse.json({
      success: true,
      comment: formattedComment
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postId = resolvedParams.id;
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Check if post exists
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      select: { id: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Fetch comments for the post
    const comments = await prisma.forumComment.findMany({
      where: {
        postId: postId,
        parentId: null // Only top-level comments for now
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profileImage: true,
            title: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                profileImage: true,
                title: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Format comments with like status
    const formattedComments = comments.map(comment => ({
      ...comment,
      isLiked: false, // TODO: Check if user liked this comment
      replies: comment.replies.map(reply => ({
        ...reply,
        isLiked: false // TODO: Check if user liked this reply
      }))
    }));

    return NextResponse.json({
      success: true,
      comments: formattedComments
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}