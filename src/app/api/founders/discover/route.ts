import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/founders/discover - Get potential founder matches
export async function GET(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const industry = searchParams.get('industry');
    const stage = searchParams.get('stage');
    const remoteOk = searchParams.get('remoteOk') === 'true';

    // Get users that the current user has already matched with or passed on
    const existingMatches = await prisma.match.findMany({
      where: {
        senderId: currentUserId
      },
      select: {
        receiverId: true
      }
    });

    const excludedUserIds = [
      currentUserId,
      ...existingMatches.map(match => match.receiverId)
    ];

    // Build filter conditions
    const whereConditions: any = {
      id: {
        notIn: excludedUserIds
      },
      roles: {
        has: 'founder'
      },
      // Only show users who have completed their profile
      AND: [
        { name: { not: null } },
        { title: { not: null } },
        { bio: { not: null } }
      ]
    };

    if (industry) {
      whereConditions.industry = industry;
    }
    
    if (stage) {
      whereConditions.stage = stage;
    }
    
    if (remoteOk) {
      whereConditions.remoteOk = true;
    }

    // Get potential matches
    const potentialMatches = await prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        skills: true,
        experience: true,
        lookingFor: true,
        image: true,
        profileImage: true,
        industry: true,
        stage: true,
        location: true,
        remoteOk: true,
        timeCommitment: true,
        fundingStatus: true,
        personalityProfile: true,
        quizScores: true,
        createdAt: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response
    const formattedMatches = potentialMatches.map(user => ({
      ...user,
      skills: user.skills ? user.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
      profileImage: user.profileImage || user.image,
      compatibilityScore: Math.floor(Math.random() * 30) + 70 // Placeholder - implement real algorithm later
    }));

    return NextResponse.json({
      founders: formattedMatches,
      hasMore: formattedMatches.length === limit
    });

  } catch (error) {
    console.error('Discover founders error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}