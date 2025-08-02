import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
  },
  {
    name: 'Legal & Compliance',
    slug: 'legal',
    description: 'Legal questions and compliance issues',
    color: '#dc2626',
    icon: 'Scale',
    order: 7
  },
  {
    name: 'Marketing & Growth',
    slug: 'marketing',
    description: 'Marketing strategies and growth tactics',
    color: '#059669',
    icon: 'TrendingUp',
    order: 8
  }
];

export async function POST() {
  try {
    // Check authentication
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // Check if categories already exist
    const existingCategories = await prisma.forumCategory.count();
    
    if (existingCategories > 0) {
      return NextResponse.json({
        message: 'Categories already exist',
        count: existingCategories
      });
    }

    // Create default categories
    const createdCategories = [];
    for (const category of defaultCategories) {
      const created = await prisma.forumCategory.create({
        data: category
      });
      createdCategories.push(created);
    }

    return NextResponse.json({
      message: 'Default categories created successfully',
      categories: createdCategories,
      count: createdCategories.length
    });

  } catch (error) {
    console.error('Category seeding error:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}