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
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');
    const budget = searchParams.get('budget');
    const status = searchParams.get('status') || 'open';
    
    const where: any = {
      status: status
    };
    
    if (serviceType && serviceType !== 'all') {
      where.serviceType = serviceType;
    }
    
    if (budget) {
      const [min, max] = budget.split('-').map(Number);
      where.budget = {
        gte: min,
        ...(max && { lte: max })
      };
    }
    
    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            title: true,
            location: true
          }
        },
        matches: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      description,
      serviceType,
      budget,
      timeline,
      complexity,
      requirements,
      techStack,
      deliverables
    } = await request.json();

    // Validate required fields
    if (!title || !description || !serviceType) {
      return NextResponse.json({
        message: 'Title, description, and service type are required'
      }, { status: 400 });
    }

    // Get user to verify they exist
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        serviceType,
        budget: budget ? parseInt(budget) : null,
        timeline,
        complexity,
        requirements,
        techStack: techStack || [],
        deliverables,
        ownerId: user.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            title: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}