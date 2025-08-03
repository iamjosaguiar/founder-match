import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

// GET /api/chat/memory - Get user's memories
export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const memoryType = searchParams.get('type');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const memories = await prisma.userMemory.findMany({
      where: {
        userId: user.id,
        ...(memoryType && { memoryType }),
        ...(category && { category }),
        OR: [
          { expiresAt: { gt: new Date() } }, // Not expired
          { expiresAt: null } // Never expires
        ]
      },
      orderBy: [
        { importance: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        memoryType: true,
        content: true,
        category: true,
        importance: true,
        confidence: true,
        source: true,
        lastUsed: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Group memories by type for easier consumption
    const groupedMemories = memories.reduce((acc, memory) => {
      if (!acc[memory.memoryType]) {
        acc[memory.memoryType] = [];
      }
      acc[memory.memoryType].push(memory);
      return acc;
    }, {} as Record<string, typeof memories>);

    return NextResponse.json({
      memories: groupedMemories,
      total: memories.length
    });

  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST /api/chat/memory - Create new memory
export async function POST(request: NextRequest) {
  try {
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

    const { 
      memoryType, 
      content, 
      category, 
      importance = 5, 
      confidence = 1.0,
      source = 'manual',
      expiresAt 
    } = await request.json();

    if (!memoryType || !content) {
      return NextResponse.json({ 
        message: 'Memory type and content are required' 
      }, { status: 400 });
    }

    const memory = await prisma.userMemory.create({
      data: {
        userId: user.id,
        memoryType,
        content,
        category,
        importance: Math.max(1, Math.min(10, importance)), // Clamp to 1-10
        confidence: Math.max(0, Math.min(1, confidence)),  // Clamp to 0-1
        source,
        ...(expiresAt && { expiresAt: new Date(expiresAt) })
      },
      select: {
        id: true,
        memoryType: true,
        content: true,
        category: true,
        importance: true,
        confidence: true,
        source: true,
        createdAt: true
      }
    });

    return NextResponse.json({ memory });

  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// PATCH /api/chat/memory - Update memory importance/usage tracking
export async function PATCH(request: NextRequest) {
  try {
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

    const { memoryIds, action } = await request.json();

    if (!memoryIds || !Array.isArray(memoryIds)) {
      return NextResponse.json({ 
        message: 'Memory IDs array is required' 
      }, { status: 400 });
    }

    let updateData = {};
    
    switch (action) {
      case 'mark_used':
        updateData = { lastUsed: new Date() };
        break;
      case 'increase_importance':
        // We'll handle this with a raw query to increment
        await prisma.$executeRaw`
          UPDATE user_memories 
          SET importance = LEAST(importance + 1, 10) 
          WHERE id = ANY(${memoryIds}) AND user_id = ${user.id}
        `;
        return NextResponse.json({ success: true });
      case 'decrease_importance':
        await prisma.$executeRaw`
          UPDATE user_memories 
          SET importance = GREATEST(importance - 1, 1) 
          WHERE id = ANY(${memoryIds}) AND user_id = ${user.id}
        `;
        return NextResponse.json({ success: true });
      default:
        return NextResponse.json({ 
          message: 'Invalid action' 
        }, { status: 400 });
    }

    await prisma.userMemory.updateMany({
      where: {
        id: { in: memoryIds },
        userId: user.id
      },
      data: updateData
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating memories:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}