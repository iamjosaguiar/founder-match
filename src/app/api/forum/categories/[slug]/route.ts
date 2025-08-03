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

    // Fetch the category with post count
    const category = await prisma.forumCategory.findUnique({
      where: {
        slug: categorySlug
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Format the response
    const formattedCategory = {
      ...category,
      postsCount: category._count.posts
    };

    // Remove the _count field from response
    delete (formattedCategory as any)._count;

    return NextResponse.json({
      success: true,
      category: formattedCategory
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}