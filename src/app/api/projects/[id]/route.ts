import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = resolvedParams.id;
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Fetch the project with all related data
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profileImage: true,
            title: true,
            location: true
          }
        },
        matches: {
          include: {
            serviceProvider: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                profileImage: true,
                title: true,
                location: true,
                hourlyRate: true,
                serviceTypes: true,
                portfolio: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = resolvedParams.id;
    const updateData = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Check if user owns the project
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existingProject.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...updateData,
        budget: updateData.budget ? parseInt(updateData.budget) : undefined,
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profileImage: true,
            title: true,
            location: true
          }
        },
        matches: {
          include: {
            serviceProvider: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                profileImage: true,
                title: true,
                location: true,
                hourlyRate: true,
                serviceTypes: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = resolvedParams.id;
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Check if user owns the project
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existingProject.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the project (this will cascade delete matches)
    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}