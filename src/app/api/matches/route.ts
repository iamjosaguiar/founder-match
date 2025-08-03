import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { sendNotificationToUser } from '@/lib/notifications';

// POST /api/matches - Record a like/pass and check for mutual match
export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    
    console.log('Match API session:', JSON.stringify(session));
    console.log('Session user ID:', session?.user?.id);
    console.log('Session user email:', session?.user?.email);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId, liked } = await request.json();

    if (!targetUserId || typeof liked !== 'boolean') {
      return NextResponse.json({ 
        message: 'targetUserId and liked (boolean) are required' 
      }, { status: 400 });
    }

    const senderId = (session.user as any).id;

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

        // Get user details for notifications
        const [sender, receiver] = await Promise.all([
          prisma.user.findUnique({
            where: { id: senderId },
            select: { id: true, name: true, title: true, image: true, profileImage: true }
          }),
          prisma.user.findUnique({
            where: { id: targetUserId },
            select: { id: true, name: true, title: true, image: true, profileImage: true }
          })
        ]);

        // Send real-time notifications to both users
        if (sender && receiver) {
          sendNotificationToUser(senderId, {
            type: 'match',
            user: {
              id: receiver.id,
              name: receiver.name,
              title: receiver.title,
              image: receiver.profileImage || receiver.image
            }
          });

          sendNotificationToUser(targetUserId, {
            type: 'match',
            user: {
              id: sender.id,
              name: sender.name,
              title: sender.title,
              image: sender.profileImage || sender.image
            }
          });
        }
      } else {
        // Just a like, send notification to the target user
        const sender = await prisma.user.findUnique({
          where: { id: senderId },
          select: { id: true, name: true, title: true, image: true, profileImage: true }
        });

        if (sender) {
          sendNotificationToUser(targetUserId, {
            type: 'like',
            user: {
              id: sender.id,
              name: sender.name,
              title: sender.title,
              image: sender.profileImage || sender.image
            }
          });
        }
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
    const session = await getSession() as any;
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

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