import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { 
      title, bio, skills, experience, lookingFor,
      industry, stage, location, remoteOk, timeCommitment, 
      fundingStatus, companyGoals, workStyle 
    } = await request.json();

    // Validate required fields
    if (!title || !bio || !skills || !experience || !lookingFor) {
      return NextResponse.json({ 
        message: 'Basic profile fields are required' 
      }, { status: 400 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        title,
        bio,
        skills, // Store as string (comma-separated from frontend)
        experience,
        lookingFor,
        industry,
        stage,
        location,
        remoteOk: remoteOk || false,
        timeCommitment,
        fundingStatus,
        companyGoals,
        workStyle,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        title: updatedUser.title,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
        lookingFor: updatedUser.lookingFor,
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}