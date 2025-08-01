import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

// Initialize OpenAI client only when needed to avoid build-time errors
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// Helper function to get user context for AI
async function getUserContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      title: true,
      bio: true,
      skills: true,
      experience: true,
      lookingFor: true,
      
      // Assessment data for rich context
      assessmentCompleted: true,
      motivation: true,
      founderPersonality: true,
      longTermVision: true,
      idealExit: true,
      weeklyCommitment: true,
      topSkills: true,
      preferredRoles: true,
      currentStage: true,
      passionateIndustries: true,
      workingStyle: true,
      
      // Recent activity
      forumPosts: {
        select: { title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 3
      },
      projects: {
        select: { title: true, description: true, status: true },
        orderBy: { createdAt: 'desc' },
        take: 2
      },
      sentMatches: {
        select: { matched: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 3
      }
    }
  });

  if (!user) return null;

  return {
    profile: {
      name: user.name,
      title: user.title,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      lookingFor: user.lookingFor
    },
    assessment: user.assessmentCompleted ? {
      motivation: user.motivation,
      founderPersonality: user.founderPersonality,
      longTermVision: user.longTermVision,
      idealExit: user.idealExit,
      weeklyCommitment: user.weeklyCommitment,
      topSkills: user.topSkills,
      preferredRoles: user.preferredRoles,
      currentStage: user.currentStage,
      passionateIndustries: user.passionateIndustries,
      workingStyle: user.workingStyle
    } : null,
    recentActivity: {
      posts: user.forumPosts,
      projects: user.projects,
      matches: user.sentMatches.length
    }
  };
}

// Helper function to get relevant memories
async function getRelevantMemories(userId: string, query: string, limit = 5) {
  // For now, get most recent and important memories
  // TODO: Implement semantic search with embeddings
  const memories = await prisma.userMemory.findMany({
    where: { userId },
    orderBy: [
      { importance: 'desc' },
      { lastUsed: 'desc' },
      { createdAt: 'desc' }
    ],
    take: limit,
    select: {
      content: true,
      memoryType: true,
      category: true,
      importance: true
    }
  });

  return memories;
}

// Helper function to extract and store new memories
async function extractAndStoreMemories(userId: string, userMessage: string, aiResponse: string) {
  // Simple memory extraction - look for key patterns
  const memoryPatterns = [
    { pattern: /i prefer|i like|i want|i need/i, type: 'preference' },
    { pattern: /my goal|i'm trying to|i hope to/i, type: 'goal' },
    { pattern: /i'm good at|i excel at|my strength/i, type: 'skill' },
    { pattern: /i struggle with|i'm not good at|my weakness/i, type: 'weakness' },
    { pattern: /i'm looking for|seeking|need help with/i, type: 'context' },
    { pattern: /i work|i do|my role|my job/i, type: 'fact' }
  ];

  const extractedMemories = [];
  
  for (const { pattern, type } of memoryPatterns) {
    if (pattern.test(userMessage)) {
      extractedMemories.push({
        userId,
        memoryType: type,
        content: userMessage,
        category: 'conversation',
        importance: 6, // Medium-high importance for explicit statements
        source: 'conversation'
      });
      break; // Only store one memory per message to avoid spam
    }
  }

  if (extractedMemories.length > 0) {
    const createdMemories = await prisma.userMemory.createMany({
      data: extractedMemories
    });
    return extractedMemories.length;
  }

  return 0;
}

// POST /api/chat - Send message and get AI response
export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { message, conversationId } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.chatConversation.findFirst({
        where: { id: conversationId, userId: user.id }
      });
      if (!conversation) {
        return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
      }
    } else {
      // Create new conversation
      conversation = await prisma.chatConversation.create({
        data: {
          userId: user.id,
          title: message.length > 50 ? message.substring(0, 50) + '...' : message
        }
      });
    }

    // Get user context and memories
    const [userContext, relevantMemories, conversationHistory] = await Promise.all([
      getUserContext(user.id),
      getRelevantMemories(user.id, message),
      prisma.chatMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
        take: 20, // Last 20 messages for context
        select: { role: true, content: true }
      })
    ]);

    // Build context-aware system prompt
    const systemPrompt = `You are an AI assistant for FounderMatch, a platform helping entrepreneurs find co-founders and build startups.

User: ${user.name}
${userContext ? `
Profile: ${userContext.profile.title ? `${userContext.profile.title} - ` : ''}${userContext.profile.bio || 'No bio available'}
Skills: ${userContext.profile.skills || 'Not specified'}
Experience: ${userContext.profile.experience || 'Not specified'}
Looking for: ${userContext.profile.lookingFor || 'Not specified'}

${userContext.assessment ? `Assessment Data:
- Motivation: ${userContext.assessment.motivation}
- Founder Type: ${userContext.assessment.founderPersonality}
- Vision: ${userContext.assessment.longTermVision}
- Exit Goal: ${userContext.assessment.idealExit}
- Weekly Commitment: ${userContext.assessment.weeklyCommitment}h
- Stage: ${userContext.assessment.currentStage}
- Industries: ${userContext.assessment.passionateIndustries}
- Work Style: ${userContext.assessment.workingStyle}` : 'Assessment not completed'}

Recent Activity:
- Community Posts: ${userContext?.recentActivity.posts.length || 0}
- Active Projects: ${userContext?.recentActivity.projects.length || 0}
- Recent Matches: ${userContext?.recentActivity.matches || 0}
` : ''}

${relevantMemories.length > 0 ? `Previous Context:
${relevantMemories.map(m => `- ${m.content} (${m.memoryType})`).join('\n')}` : ''}

Guidelines:
- Be helpful, encouraging, and founder-focused
- Reference their specific situation and goals when relevant
- Suggest actionable next steps related to co-founder matching, startup building
- Keep responses conversational but informative
- If they ask about the platform, help them navigate features`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ];

    // Get AI response
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return NextResponse.json({ message: 'Failed to generate response' }, { status: 500 });
    }

    // Save both messages to database
    await Promise.all([
      prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: message,
          tokenCount: completion.usage?.prompt_tokens || 0
        }
      }),
      prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: aiResponse,
          tokenCount: completion.usage?.completion_tokens || 0,
          metadata: {
            model: 'gpt-4o-mini',
            contextUsed: {
              hasProfile: !!userContext?.profile,
              hasAssessment: !!userContext?.assessment,
              memoriesCount: relevantMemories.length,
              conversationLength: conversationHistory.length
            }
          }
        }
      })
    ]);

    // Extract and store new memories from this conversation
    const memoriesStored = await extractAndStoreMemories(user.id, message, aiResponse);

    // Update conversation timestamp
    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation.id,
      memoriesStored,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}