import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type ServiceProvider = {
  id: string;
  name: string;
  title: string;
  bio: string;
  location?: string;
  profileImage?: string;
  serviceTypes: string[];
  skills: string;
  experience: string;
  hourlyRate?: number;
  availability: string;
  remoteOk: boolean;
  portfolio: string;
  completedProjects: number;
  totalProjects: number;
};

type MatchScore = {
  provider: ServiceProvider;
  score: number;
  reasons: string[];
};

// Calculate match score between a project and service provider
function calculateMatchScore(project: any, provider: ServiceProvider): MatchScore {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // Service type match (30 points)
  if (provider.serviceTypes.includes(project.serviceType)) {
    score += 30;
    reasons.push("Perfect service type match");
  }

  // Skills match (25 points)
  const providerSkills = provider.skills ? provider.skills.toLowerCase().split(',').map(s => s.trim()) : [];
  const projectTechStack = project.techStack || [];
  
  let skillMatches = 0;
  projectTechStack.forEach((tech: string) => {
    if (providerSkills.some(skill => skill.includes(tech.toLowerCase()) || tech.toLowerCase().includes(skill))) {
      skillMatches++;
    }
  });
  
  if (projectTechStack.length > 0) {
    const skillMatchRatio = skillMatches / projectTechStack.length;
    const skillScore = Math.round(skillMatchRatio * 25);
    score += skillScore;
    if (skillScore > 0) {
      reasons.push(`${skillMatches}/${projectTechStack.length} required skills matched`);
    }
  } else {
    // If no specific tech stack, give moderate score
    score += 15;
    reasons.push("General expertise in service area");
  }

  // Experience level match (15 points)
  const complexityExperienceMap: Record<string, string[]> = {
    'simple': ['entry-level', 'intermediate', 'senior', 'expert'],
    'medium': ['intermediate', 'senior', 'expert'],
    'complex': ['senior', 'expert']
  };
  
  const suitableExperience = complexityExperienceMap[project.complexity || 'medium'] || [];
  if (suitableExperience.includes(provider.experience)) {
    score += 15;
    reasons.push(`${provider.experience.charAt(0).toUpperCase() + provider.experience.slice(1)} level suits project complexity`);
  }

  // Budget compatibility (15 points)
  if (project.budget && provider.hourlyRate) {
    // Estimate project hours (simple heuristic)
    const estimatedHours = project.complexity === 'simple' ? 20 : 
                          project.complexity === 'complex' ? 100 : 50;
    const estimatedCost = provider.hourlyRate * estimatedHours;
    
    if (estimatedCost <= project.budget * 1.2) { // 20% buffer
      const budgetScore = estimatedCost <= project.budget ? 15 : 10;
      score += budgetScore;
      reasons.push(budgetScore === 15 ? "Within budget" : "Close to budget");
    }
  } else if (!project.budget) {
    // If no budget specified, give neutral score
    score += 8;
    reasons.push("Budget flexibility");
  }

  // Availability match (10 points)
  const timelineAvailabilityMap: Record<string, string[]> = {
    'asap': ['immediate'],
    'within_week': ['immediate', 'within_week'],
    'within_month': ['immediate', 'within_week', 'within_month'],
    'flexible': ['immediate', 'within_week', 'within_month', 'flexible']
  };
  
  const suitableAvailability = timelineAvailabilityMap[project.timeline || 'flexible'] || [];
  if (suitableAvailability.includes(provider.availability)) {
    score += 10;
    reasons.push("Available for project timeline");
  }

  // Portfolio/experience bonus (5 points)
  if (provider.completedProjects > 0) {
    const experienceBonus = Math.min(provider.completedProjects, 5);
    score += experienceBonus;
    reasons.push(`${provider.completedProjects} completed projects`);
  }

  // Location/remote work compatibility
  // This is informational, doesn't affect score but could be displayed
  if (provider.remoteOk) {
    reasons.push("Available for remote work");
  }

  return {
    provider,
    score: Math.min(score, maxScore),
    reasons
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const minScore = parseInt(searchParams.get('minScore') || '20');

    // Get the project
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: { id: true, email: true }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Check if user has access to this project
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!currentUser || project.owner.id !== currentUser.id) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Get all service providers
    const serviceProviders = await prisma.user.findMany({
      where: {
        roles: { has: 'service_provider' },
        name: { not: null },
        title: { not: null },
        serviceTypes: { isEmpty: false }
      },
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        location: true,
        profileImage: true,
        serviceTypes: true,
        skills: true,
        experience: true,
        hourlyRate: true,
        availability: true,
        remoteOk: true,
        portfolio: true,
        projectMatches: {
          select: { status: true }
        }
      }
    });

    // Transform and calculate match scores
    const matches: MatchScore[] = serviceProviders
      .map(provider => ({
        ...provider,
        skills: provider.skills || '',
        portfolio: provider.portfolio || '[]',
        completedProjects: provider.projectMatches.filter(m => m.status === 'completed').length,
        totalProjects: provider.projectMatches.length
      }))
      .map(provider => calculateMatchScore(project, provider))
      .filter(match => match.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        serviceType: project.serviceType,
        complexity: project.complexity,
        timeline: project.timeline,
        budget: project.budget,
        techStack: project.techStack
      },
      matches: matches.map(match => ({
        provider: {
          id: match.provider.id,
          name: match.provider.name,
          title: match.provider.title,
          bio: match.provider.bio,
          location: match.provider.location,
          profileImage: match.provider.profileImage,
          serviceTypes: match.provider.serviceTypes,
          skills: match.provider.skills ? match.provider.skills.split(',').map(s => s.trim()) : [],
          experience: match.provider.experience,
          hourlyRate: match.provider.hourlyRate,
          availability: match.provider.availability,
          remoteOk: match.provider.remoteOk,
          completedProjects: match.provider.completedProjects,
          totalProjects: match.provider.totalProjects
        },
        score: match.score,
        reasons: match.reasons
      })),
      totalFound: matches.length
    });

  } catch (error) {
    console.error('Error finding project matches:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { proposal, proposedRate, proposedTimeline } = await request.json();

    if (!proposal || !proposal.trim()) {
      return NextResponse.json({ message: 'Proposal is required' }, { status: 400 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get the project
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        ownerId: true, 
        status: true,
        title: true 
      }
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.status !== 'open') {
      return NextResponse.json({ message: 'Project is no longer accepting proposals' }, { status: 400 });
    }

    if (project.ownerId === currentUser.id) {
      return NextResponse.json({ message: 'Cannot apply to your own project' }, { status: 400 });
    }

    // Check if user already applied
    const existingMatch = await prisma.projectMatch.findUnique({
      where: {
        projectId_serviceProviderId: {
          projectId: params.id,
          serviceProviderId: currentUser.id
        }
      }
    });

    if (existingMatch) {
      return NextResponse.json({ message: 'You have already applied to this project' }, { status: 400 });
    }

    // Create the proposal
    const match = await prisma.projectMatch.create({
      data: {
        projectId: params.id,
        serviceProviderId: currentUser.id,
        proposal: proposal.trim(),
        proposedRate: proposedRate ? parseInt(proposedRate) : null,
        proposedTimeline: proposedTimeline || null,
        status: 'pending'
      },
      include: {
        serviceProvider: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profileImage: true,
            title: true,
            location: true,
            hourlyRate: true,
            serviceTypes: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Proposal submitted successfully',
      match
    });

  } catch (error) {
    console.error('Error submitting proposal:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}