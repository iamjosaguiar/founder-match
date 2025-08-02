import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/profile - Fetch user profile
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profileImage: true,
        title: true,
        bio: true,
        skills: true,
        experience: true,
        lookingFor: true,
        
        // Legacy Big Five fields
        quizCompleted: true,
        quizScores: true,
        
        // New founder assessment fields
        assessmentCompleted: true,
        motivation: true,
        founderPersonality: true,
        pressureResponse: true,
        conflictHandling: true,
        communicationStyle: true,
        bigFiveData: true,
        longTermVision: true,
        idealExit: true,
        weeklyCommitment: true,
        fullTimeReady: true,
        noPayCommitment: true,
        locationFlexible: true,
        riskAppetite: true,
        topSkills: true,
        weakAreas: true,
        preferredRoles: true,
        technicalLevel: true,
        portfolioLinks: true,
        biggestAchievement: true,
        currentStage: true,
        lookingToJoin: true,
        passionateIndustries: true,
        domainExperience: true,
        previousStartupExp: true,
        workingStyle: true,
        workPreference: true,
        timezoneFlexibility: true,
        meetingRhythm: true,
        collaborationScale: true,
        scenarioResponse: true,
        equityExpectation: true,
        dealbreakers: true,
        previousCofounderExp: true,
        psychometricData: true,
        
        personalityProfile: true,
        projectLinks: true,
        industry: true,
        stage: true,
        location: true,
        remoteOk: true,
        timeCommitment: true,
        fundingStatus: true,
        companyGoals: true,
        workStyle: true,
        isTechnical: true,
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
    const session = await auth() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { 
      name, title, bio, skills, experience, lookingFor, projectLinks, avatar, profileImage,
      industry, stage, location, remoteOk, timeCommitment, fundingStatus, companyGoals, workStyle, isTechnical 
    } = await request.json();

    // For avatar-only updates, we don't require all fields
    const isAvatarOnlyUpdate = (avatar || profileImage) && 
      (!title && !bio && !experience && !lookingFor);

    // Validate required fields only for full profile updates
    if (!isAvatarOnlyUpdate && (!name || !title || !bio || !experience || !lookingFor)) {
      return NextResponse.json({ 
        message: 'Basic profile fields are required' 
      }, { status: 400 });
    }

    console.log('Profile update request:', { 
      name, title, bio, skills, experience, lookingFor,
      industry, stage, location, remoteOk, timeCommitment, fundingStatus, companyGoals, workStyle, isTechnical 
    });

    // Update user profile
    console.log('Attempting to update user profile...');
    
    // Build update data object, only including provided fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Always update name if provided
    if (name) updateData.name = name;
    
    // For avatar updates
    if (avatar) updateData.image = avatar;
    if (profileImage || avatar) updateData.profileImage = profileImage || avatar;
    
    // For full profile updates
    if (!isAvatarOnlyUpdate) {
      if (title) updateData.title = title;
      if (bio) updateData.bio = bio;
      if (skills) updateData.skills = skills;
      if (experience) updateData.experience = experience;
      if (lookingFor) updateData.lookingFor = lookingFor;
      if (projectLinks) updateData.projectLinks = projectLinks;
      if (industry) updateData.industry = industry;
      if (stage) updateData.stage = stage;
      if (location) updateData.location = location;
      if (remoteOk !== undefined) updateData.remoteOk = remoteOk;
      if (timeCommitment) updateData.timeCommitment = timeCommitment;
      if (fundingStatus) updateData.fundingStatus = fundingStatus;
      if (companyGoals) updateData.companyGoals = companyGoals;
      if (workStyle) updateData.workStyle = workStyle;
      if (isTechnical !== undefined) updateData.isTechnical = isTechnical;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
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
        profileImage: true,
        industry: true,
        stage: true,
        location: true,
        remoteOk: true,
        timeCommitment: true,
        fundingStatus: true,
        companyGoals: true,
        workStyle: true,
        isTechnical: true,
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
      avatar: updatedUser.profileImage,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}