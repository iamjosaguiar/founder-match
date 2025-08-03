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

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: (session.user as any).id,
          postId: postId
        }
      }
    });

    let isLiked = false;
    let likesCount = 0;

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: (session.user as any).id,
            postId: postId
          }
        }
      });

      // Decrement likes count
      const updatedPost = await prisma.forumPost.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1
          }
        },
        select: { likesCount: true }
      });

      isLiked = false;
      likesCount = updatedPost.likesCount;
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          userId: (session.user as any).id,
          postId: postId
        }
      });

      // Increment likes count
      const updatedPost = await prisma.forumPost.update({
        where: { id: postId },
        data: {
          likesCount: {
            increment: 1
          }
        },
        select: { likesCount: true }
      });

      isLiked = true;
      likesCount = updatedPost.likesCount;
    }

    return NextResponse.json({
      success: true,
      isLiked,
      likesCount
    });

  } catch (error) {
    console.error('Error toggling post like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}