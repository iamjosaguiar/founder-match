import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; matchId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, matchId } = params;
    const { status } = await request.json();

    if (!projectId || !matchId) {
      return NextResponse.json({ error: 'Project ID and Match ID are required' }, { status: 400 });
    }

    if (!['accepted', 'declined', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Check if user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if match exists
    const match = await prisma.projectMatch.findUnique({
      where: { id: matchId, projectId: projectId }
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Update the match status
    const updatedMatch = await prisma.projectMatch.update({
      where: { id: matchId },
      data: { 
        status,
        updatedAt: new Date()
      },
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
    });

    // If accepted, update project status to in_progress
    if (status === 'accepted') {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'in_progress' }
      });
    }

    return NextResponse.json({
      success: true,
      match: updatedMatch
    });

  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    );
  }
}