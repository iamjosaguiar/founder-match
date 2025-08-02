import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/chat/conversations - Get user's chat conversations
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
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

    const conversations = await prisma.chatConversation.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          select: {
            id: true,
            content: true,
            role: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1 // Get last message for preview
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Format conversations with last message preview
    const formattedConversations = conversations.map(conv => ({
      id: conv.id,
      title: conv.title || 'New Conversation',
      summary: conv.summary,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessage: conv.messages[0] || null,
      messageCount: conv.messages.length
    }));

    return NextResponse.json({
      conversations: formattedConversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST /api/chat/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
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

    const { title } = await request.json();

    const conversation = await prisma.chatConversation.create({
      data: {
        userId: user.id,
        title: title || 'New Conversation'
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ conversation });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}