import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all users who have completed the quiz for the discover page
    const users = await prisma.user.findMany({
      where: {
        quizCompleted: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        bio: true,
        skills: true,
        experience: true,
        lookingFor: true,
        quizScores: true,
        personalityProfile: true,
        industry: true,
        stage: true,
        location: true,
        remoteOk: true,
        timeCommitment: true,
        fundingStatus: true,
        companyGoals: true,
        workStyle: true,
        profileImage: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data for frontend consumption
    const transformedUsers = users.map(user => ({
      ...user,
      skills: user.skills ? user.skills.split(',').map(s => s.trim()) : [],
      avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UN',
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}