import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { 
      roles, founderJourney, title, bio, skills, experience, lookingFor,
      industry, stage, location, remoteOk, timeCommitment, 
      fundingStatus, companyGoals, workStyle, isTechnical 
    } = await request.json();

    // Validate that at least some data is provided
    if (!roles && !founderJourney && !title && !bio && !skills && !experience && !lookingFor && !industry) {
      return NextResponse.json({ 
        message: 'At least one field must be provided' 
      }, { status: 400 });
    }

    // Build update data object with only provided fields
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (roles !== undefined) updateData.roles = roles;
    if (founderJourney !== undefined) updateData.founderJourney = founderJourney;
    if (title !== undefined) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (experience !== undefined) updateData.experience = experience;
    if (lookingFor !== undefined) updateData.lookingFor = lookingFor;
    if (industry !== undefined) updateData.industry = industry;
    if (stage !== undefined) updateData.stage = stage;
    if (location !== undefined) updateData.location = location;
    if (remoteOk !== undefined) updateData.remoteOk = remoteOk;
    if (timeCommitment !== undefined) updateData.timeCommitment = timeCommitment;
    if (fundingStatus !== undefined) updateData.fundingStatus = fundingStatus;
    if (companyGoals !== undefined) updateData.companyGoals = companyGoals;
    if (workStyle !== undefined) updateData.workStyle = workStyle;
    if (isTechnical !== undefined) updateData.isTechnical = isTechnical;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
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