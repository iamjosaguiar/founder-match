import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categorySlug = resolvedParams.slug;
    if (!categorySlug) {
      return NextResponse.json({ error: 'Category slug is required' }, { status: 400 });
    }

    // Get sort parameter
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // First, check if category exists
    const category = await prisma.forumCategory.findUnique({
      where: { slug: categorySlug },
      select: { id: true }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Define sorting options
    let orderBy: any = { createdAt: 'desc' }; // Default: recent

    switch (sort) {
      case 'popular':
        orderBy = [
          { isPinned: 'desc' },
          { likesCount: 'desc' },
          { commentsCount: 'desc' },
          { views: 'desc' }
        ];
        break;
      case 'oldest':
        orderBy = [
          { isPinned: 'desc' },
          { createdAt: 'asc' }
        ];
        break;
      case 'recent':
      default:
        orderBy = [
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ];
        break;
    }

    // Fetch posts for the category
    const posts = await prisma.forumPost.findMany({
      where: {
        category: {
          slug: categorySlug
        }
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        }
      },
      orderBy,
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await prisma.forumPost.count({
      where: {
        category: {
          slug: categorySlug
        }
      }
    });

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching category posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}