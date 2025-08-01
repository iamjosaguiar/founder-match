import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { getRelevantKnowledge } from '@/lib/knowledge-base';
import { searchDuckDuckGo, shouldPerformWebSearch, formatSearchResults } from '@/lib/web-search';
import { updateBusinessFromConversation } from '@/lib/business-updater';

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
      
      // Business context
      currentBusiness: {
        select: {
          id: true,
          name: true,
          description: true,
          industry: true,
          businessType: true,
          subType: true,
          location: true,
          country: true,
          targetMarket: true,
          targetAudience: true,
          stage: true,
          teamSize: true,
          revenueRange: true,
          businessModel: true,
          revenueModel: true,
          pricePoint: true,
          primaryServices: true,
          specialties: true,
          mainCompetitors: true,
          marketPosition: true
        }
      },
      
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
    business: user.currentBusiness ? {
      id: user.currentBusiness.id,
      name: user.currentBusiness.name,
      description: user.currentBusiness.description ?? undefined,
      industry: user.currentBusiness.industry,
      businessType: user.currentBusiness.businessType,
      subType: user.currentBusiness.subType ?? undefined,
      location: user.currentBusiness.location ?? undefined,
      country: user.currentBusiness.country ?? undefined,
      targetMarket: user.currentBusiness.targetMarket ?? undefined,
      targetAudience: user.currentBusiness.targetAudience ?? undefined,
      stage: user.currentBusiness.stage,
      teamSize: user.currentBusiness.teamSize ?? undefined,
      revenueRange: user.currentBusiness.revenueRange ?? undefined,
      businessModel: user.currentBusiness.businessModel ?? undefined,
      revenueModel: user.currentBusiness.revenueModel ?? undefined,
      pricePoint: user.currentBusiness.pricePoint ?? undefined,
      primaryServices: user.currentBusiness.primaryServices ?? undefined,
      specialties: user.currentBusiness.specialties ?? undefined,
      mainCompetitors: user.currentBusiness.mainCompetitors ?? undefined,
      marketPosition: user.currentBusiness.marketPosition ?? undefined
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
  // Enhanced memory extraction - look for key patterns
  const memoryPatterns = [
    { pattern: /i prefer|i like|i want|i need/i, type: 'preference' },
    { pattern: /my goal|i'm trying to|i hope to|my plan is/i, type: 'goal' },
    { pattern: /i'm good at|i excel at|my strength/i, type: 'skill' },
    { pattern: /i struggle with|i'm not good at|my weakness/i, type: 'weakness' },
    { pattern: /i'm looking for|seeking|need help with/i, type: 'context' },
    { pattern: /i work|i do|my role|my job/i, type: 'fact' },
    { pattern: /i'm thinking about|considering|planning to build|working on|creating|developing/i, type: 'goal' },
    { pattern: /my startup|my company|my business|my idea|my project/i, type: 'context' },
    { pattern: /i have experience|i've worked|i used to|i previously/i, type: 'fact' }
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
  console.log('🚨 CHAT API CALLED - Starting request processing');
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
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
    console.log('📝 MESSAGE RECEIVED:', message);

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

    // Get user context, memories, and relevant knowledge
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

    // Get relevant knowledge with error handling
    let relevantKnowledge = '';
    try {
      relevantKnowledge = await getRelevantKnowledge(message, userContext);
    } catch (knowledgeError) {
      console.warn('Knowledge retrieval error:', knowledgeError);
      // Continue without knowledge base if it fails
      relevantKnowledge = '';
    }

    // Perform web search if the query would benefit from current information
    let webSearchResults = '';
    console.log('🚀 Starting web search check for message:', message);
    
    if (shouldPerformWebSearch(message)) {
      try {
        console.log('🔍 Performing web search for:', message);
        const searchResult = await searchDuckDuckGo(message, userContext?.business);
        if (searchResult) {
          webSearchResults = formatSearchResults(searchResult);
          console.log('✅ Web search completed successfully, results length:', webSearchResults.length);
        } else {
          console.log('❌ Web search returned no results');
          // Add guidance for local/competitor queries when search fails
          if (message.toLowerCase().includes('competitor') || message.toLowerCase().includes('local')) {
            webSearchResults = `**Web Search Note:** I attempted to search for current information but didn't find specific results for this query. For local competitor research, I recommend:\n\n• Google Maps search for similar businesses in your area\n• Industry-specific directories and review sites\n• Local business association listings\n• Social media platforms for local business discovery\n\n`;
          }
        }
      } catch (searchError) {
        console.warn('💥 Web search error:', searchError);
        // Continue without web search if it fails
        webSearchResults = '';
      }
    } else {
      console.log('❌ Web search not triggered for this message');
    }

    // Build context-aware system prompt
    const systemPrompt = `You are CoFoundr, a personal business sidekick AI for entrepreneurs and business owners. Your role is to be their trusted co-pilot, helping them navigate challenges, make decisions, and grow their businesses.

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

${userContext.business ? `CURRENT BUSINESS:
- Name: ${userContext.business.name}
- Type: ${userContext.business.businessType}${userContext.business.subType ? ` (${userContext.business.subType})` : ''}
- Industry: ${userContext.business.industry}
- Location: ${userContext.business.location || 'Not specified'}${userContext.business.country ? `, ${userContext.business.country}` : ''}
- Stage: ${userContext.business.stage}
- Target Market: ${userContext.business.targetMarket || 'Not specified'}
- Business Model: ${userContext.business.businessModel || 'Not specified'}
- Team Size: ${userContext.business.teamSize || 'Not specified'}
- Revenue Range: ${userContext.business.revenueRange || 'Not specified'}
- Price Point: ${userContext.business.pricePoint || 'Not specified'}
${userContext.business.primaryServices ? `- Primary Services: ${Array.isArray(userContext.business.primaryServices) ? userContext.business.primaryServices.join(', ') : userContext.business.primaryServices}` : ''}
${userContext.business.specialties ? `- Specialties: ${Array.isArray(userContext.business.specialties) ? userContext.business.specialties.join(', ') : userContext.business.specialties}` : ''}
${userContext.business.targetAudience ? `- Target Audience: ${userContext.business.targetAudience}` : ''}
${userContext.business.description ? `- Description: ${userContext.business.description}` : ''}` : 'No business profile set up'}

Recent Activity:
- Community Posts: ${userContext?.recentActivity.posts.length || 0}
- Active Projects: ${userContext?.recentActivity.projects.length || 0}
- Recent Matches: ${userContext?.recentActivity.matches || 0}
` : ''}

${relevantMemories.length > 0 ? `Previous Context:
${relevantMemories.map(m => `- ${m.content} (${m.memoryType})`).join('\n')}` : ''}

${relevantKnowledge ? `SPECIALIZED KNOWLEDGE:
${relevantKnowledge}

IMPORTANT: When the user requests copywriting help, ALWAYS start by using the 6-Point Calibration Checklist from your specialized knowledge before providing any copy. Ask about:
1. Channel Context (Landing Page, Ad, Email, DM, etc.)
2. Audience Mindset (Rational, Emotional, Status-driven)
3. Offer Type (High-trust, Impulse-friendly, Regulated)
4. Emotional Temperature (Cold, Warm, Hot, Skeptical)
5. Tone Altitude (Expert, Authority, Guide, Disruptive)
6. Strategic Frame (What belief are we shifting/anchoring)

Apply all specialized frameworks naturally without mentioning methodology names to users.

` : ''}${webSearchResults ? `CURRENT WEB INFORMATION:
${webSearchResults}

Use this current information to provide up-to-date insights and data in your response. Combine web search results with your business expertise for comprehensive answers.

` : ''}Your Personality & Approach:
- Act as CoFoundr, their personal business co-pilot and trusted sidekick
- Be encouraging, practical, and action-oriented
- Think like a seasoned entrepreneur who's been through it all
- Provide specific, actionable advice tailored to their business and stage
- Remember their goals, challenges, and preferences from past conversations
- Help them think through problems, not just give generic advice
- Be their sounding board for ideas, decisions, and strategies

Focus Areas:
- Business strategy and planning
- Problem-solving and decision making
- Growth tactics and execution
- Team building and hiring (including co-founders)
- Product development and market fit
- Fundraising and financial planning
- Personal productivity and founder wellbeing
- Networking and partnership opportunities

Keep responses conversational, practical, and personalized to their specific business context.`;

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
              conversationLength: conversationHistory.length,
              webSearchUsed: !!webSearchResults,
              hasKnowledgeBase: !!relevantKnowledge
            }
          }
        }
      })
    ]);

    // Extract and store new memories from this conversation
    const memoriesStored = await extractAndStoreMemories(user.id, message, aiResponse);

    // Update business context from conversation if user has a current business
    let businessUpdated = false;
    let updatedBusinessFields: string[] = [];
    
    if (userContext?.business?.id) {
      try {
        const businessUpdate = await updateBusinessFromConversation(
          user.id,
          userContext.business.id,
          message,
          aiResponse,
          userContext.business
        );
        
        businessUpdated = businessUpdate.updated;
        updatedBusinessFields = businessUpdate.updatedFields;
        
        if (businessUpdated) {
          console.log('📊 Business context updated from conversation:', updatedBusinessFields);
        }
      } catch (businessUpdateError) {
        console.warn('⚠️ Business context update failed:', businessUpdateError);
      }
    }

    // Update conversation timestamp
    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation.id,
      memoriesStored,
      businessUpdated,
      updatedBusinessFields,
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