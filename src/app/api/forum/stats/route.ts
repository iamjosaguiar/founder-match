import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // Get community stats in parallel
    const [
      totalPosts,
      totalCategories,
      totalMembers,
      recentPosts
    ] = await Promise.all([
      // Total posts count
      prisma.forumPost.count(),
      
      // Active categories count
      prisma.forumCategory.count({
        where: { isActive: true }
      }),
      
      // Total members (users who have posted or commented)
      prisma.user.count({
        where: {
          OR: [
            { forumPosts: { some: {} } },
            { forumComments: { some: {} } }
          ]
        }
      }),
      
      // Recent posts in last 24 hours
      prisma.forumPost.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Calculate "online now" as users who posted/commented in last hour
    // This is a rough approximation of activity
    const onlineNow = await prisma.user.count({
      where: {
        OR: [
          {
            forumPosts: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
                }
              }
            }
          },
          {
            forumComments: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
                }
              }
            }
          }
        ]
      }
    });

    return NextResponse.json({
      totalPosts,
      totalCategories,
      totalMembers,
      onlineNow,
      recentPosts
    });

  } catch (error) {
    console.error('Error fetching forum stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}