import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

// PATCH /api/chat/memory/[id] - Update specific memory
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { content, importance, confidence } = await request.json();

    const updateData: any = {};
    if (content !== undefined) updateData.content = content;
    if (importance !== undefined) updateData.importance = Math.max(1, Math.min(10, importance));
    if (confidence !== undefined) updateData.confidence = Math.max(0, Math.min(1, confidence));
    
    updateData.updatedAt = new Date();

    const memory = await prisma.userMemory.updateMany({
      where: { 
        id: resolvedParams.id,
        userId: user.id // Ensure user owns this memory
      },
      data: updateData
    });

    if (memory.count === 0) {
      return NextResponse.json({ message: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE /api/chat/memory/[id] - Delete specific memory
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const memory = await prisma.userMemory.deleteMany({
      where: { 
        id: resolvedParams.id,
        userId: user.id // Ensure user owns this memory
      }
    });

    if (memory.count === 0) {
      return NextResponse.json({ message: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}