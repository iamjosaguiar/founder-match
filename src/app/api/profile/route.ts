import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/profile - Fetch user profile
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        bio: true,
        skills: true,
        experience: true,
        lookingFor: true,
        quizCompleted: true,
        quizScores: true,
        personalityProfile: true,
        projectLinks: true,
        image: true,
        industry: true,
        stage: true,
        location: true,
        remoteOk: true,
        timeCommitment: true,
        fundingStatus: true,
        companyGoals: true,
        workStyle: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Parse skills from comma-separated string to array
    const skills = user.skills ? user.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    // Parse project links from JSON string
    let projectLinks = [];
    try {
      projectLinks = user.projectLinks ? JSON.parse(user.projectLinks as string) : [];
    } catch {
      projectLinks = [];
    }

    return NextResponse.json({
      ...user,
      skills,
      projectLinks,
      avatar: user.image,
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// PATCH /api/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { 
      name, title, bio, skills, experience, lookingFor, projectLinks, avatar,
      industry, stage, location, remoteOk, timeCommitment, fundingStatus, companyGoals, workStyle 
    } = await request.json();

    // Validate required fields
    if (!name || !title || !bio || !experience || !lookingFor) {
      return NextResponse.json({ 
        message: 'Basic profile fields are required' 
      }, { status: 400 });
    }

    console.log('Profile update request:', { 
      name, title, bio, skills, experience, lookingFor,
      industry, stage, location, remoteOk, timeCommitment, fundingStatus, companyGoals, workStyle 
    });

    // Update user profile
    console.log('Attempting to update user profile...');
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        title,
        bio,
        skills, // Store as comma-separated string
        experience,
        lookingFor,
        projectLinks, // Store as JSON string
        image: avatar, // Store avatar URL in image field
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
        projectLinks: true,
        image: true,
        industry: true,
        stage: true,
        location: true,
        remoteOk: true,
        timeCommitment: true,
        fundingStatus: true,
        companyGoals: true,
        workStyle: true,
      },
    });

    // Parse skills from comma-separated string to array
    const skillsArray = updatedUser.skills ? updatedUser.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    // Parse project links from JSON string
    let projectLinksArray = [];
    try {
      projectLinksArray = updatedUser.projectLinks ? JSON.parse(updatedUser.projectLinks as string) : [];
    } catch {
      projectLinksArray = [];
    }

    return NextResponse.json({
      ...updatedUser,
      skills: skillsArray,
      projectLinks: projectLinksArray,
      avatar: updatedUser.image,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}