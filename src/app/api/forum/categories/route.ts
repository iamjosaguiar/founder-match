import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    let categories = await prisma.forumCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                profileImage: true
              }
            },
            commentsCount: true,
            likesCount: true
          },
          orderBy: { createdAt: 'desc' },
          take: 3 // Latest 3 posts per category
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    // If no categories exist, create default ones
    if (categories.length === 0) {
      console.log('No categories found, creating default categories...');
      
      const defaultCategories = [
        {
          name: 'General Discussion',
          slug: 'general',
          description: 'General discussions about startups and entrepreneurship',
          color: '#6366f1',
          icon: 'MessageCircle',
          order: 1
        },
        {
          name: 'Introductions',
          slug: 'introductions',
          description: 'Introduce yourself to the community',
          color: '#10b981',
          icon: 'Users',
          order: 2
        },
        {
          name: 'Idea Validation',
          slug: 'idea-validation',
          description: 'Get feedback on your startup ideas',
          color: '#f59e0b',
          icon: 'Lightbulb',
          order: 3
        },
        {
          name: 'Co-founder Search',
          slug: 'co-founder-search',
          description: 'Looking for co-founders or team members',
          color: '#ef4444',
          icon: 'Target',
          order: 4
        },
        {
          name: 'Technical Discussion',
          slug: 'technical',
          description: 'Technical questions and development discussions',
          color: '#8b5cf6',
          icon: 'Code',
          order: 5
        },
        {
          name: 'Business & Strategy',
          slug: 'business',
          description: 'Business strategy, operations, and growth',
          color: '#0ea5e9',
          icon: 'Briefcase',
          order: 6
        }
      ];

      // Create default categories
      for (const category of defaultCategories) {
        await prisma.forumCategory.create({
          data: category
        });
      }

      // Fetch categories again
      categories = await prisma.forumCategory.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              author: {
                select: {
                  name: true,
                  profileImage: true
                }
              },
              commentsCount: true,
              likesCount: true
            },
            orderBy: { createdAt: 'desc' },
            take: 3 // Latest 3 posts per category
          },
          _count: {
            select: {
              posts: true
            }
          }
        }
      });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching forum categories:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication - only admins can create categories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { name, description, color, icon } = await request.json();

    if (!name) {
      return NextResponse.json({
        message: 'Category name is required'
      }, { status: 400 });
    }

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Get next order number
    const lastCategory = await prisma.forumCategory.findFirst({
      orderBy: { order: 'desc' }
    });

    const category = await prisma.forumCategory.create({
      data: {
        name,
        slug,
        description,
        color: color || '#6366f1',
        icon,
        order: (lastCategory?.order || 0) + 1
      }
    });

    return NextResponse.json({
      message: 'Category created successfully',
      category
    });

  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}