import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/matches - Record a like/pass and check for mutual match
export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId, liked } = await request.json();

    if (!targetUserId || typeof liked !== 'boolean') {
      return NextResponse.json({ 
        message: 'targetUserId and liked (boolean) are required' 
      }, { status: 400 });
    }

    const senderId = session.user.id;

    // Check if match already exists
    const existingMatch = await prisma.match.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId: targetUserId
        }
      }
    });

    if (existingMatch) {
      return NextResponse.json({ 
        message: 'Match already recorded' 
      }, { status: 400 });
    }

    // Create the match record
    await prisma.match.create({
      data: {
        senderId,
        receiverId: targetUserId,
        liked,
        matched: false // Will be updated if mutual
      }
    });

    let isMutualMatch = false;

    // If this was a like, check for mutual match
    if (liked) {
      const reciprocalMatch = await prisma.match.findUnique({
        where: {
          senderId_receiverId: {
            senderId: targetUserId,
            receiverId: senderId
          }
        }
      });

      // If the other person also liked us, it's a mutual match!
      if (reciprocalMatch && reciprocalMatch.liked) {
        isMutualMatch = true;

        // Update both records to show they're matched
        await prisma.match.updateMany({
          where: {
            OR: [
              { senderId, receiverId: targetUserId },
              { senderId: targetUserId, receiverId: senderId }
            ]
          },
          data: { matched: true }
        });
      }
    }

    return NextResponse.json({
      success: true,
      matched: isMutualMatch,
      message: isMutualMatch ? "It's a mutual match! 🎉" : "Match recorded"
    });

  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET /api/matches - Get user's mutual matches
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all mutual matches
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { senderId: userId, matched: true },
          { receiverId: userId, matched: true }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            title: true,
            image: true,
            profileImage: true,
            skills: true,
            bio: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            title: true,
            image: true,
            profileImage: true,
            skills: true,
            bio: true
          }
        }
      }
    });

    // Format the response to show the other person in each match
    const formattedMatches = matches.map(match => {
      const otherUser = match.senderId === userId ? match.receiver : match.sender;
      return {
        id: match.id,
        matchedAt: match.createdAt,
        user: {
          ...otherUser,
          skills: otherUser.skills ? otherUser.skills.split(',').map(s => s.trim()) : [],
          avatar: otherUser.name ? otherUser.name.split(' ').map(n => n[0]).join('') : 'U',
          profileImage: otherUser.profileImage || otherUser.image
        }
      };
    });

    return NextResponse.json({ matches: formattedMatches });

  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}