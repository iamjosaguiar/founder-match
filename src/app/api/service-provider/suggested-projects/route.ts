import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Project = {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  budget?: number;
  timeline?: string;
  complexity?: string;
  techStack: string[];
  requirements?: string;
  status: string;
  createdAt: Date;
  owner: {
    id: string;
    name: string;
    title?: string;
    location?: string;
  };
  matchCount: number;
};

type ProjectMatch = {
  project: Project;
  score: number;
  reasons: string[];
};

// Calculate match score between a service provider and project
function calculateProviderProjectMatch(provider: any, project: Project): ProjectMatch {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // Service type match (30 points)
  if (provider.serviceTypes.includes(project.serviceType)) {
    score += 30;
    reasons.push("Perfect service type match");
  }

  // Skills match (25 points)
  const providerSkills = provider.skills ? provider.skills.toLowerCase().split(',').map((s: string) => s.trim()) : [];
  const projectTechStack = project.techStack || [];
  
  let skillMatches = 0;
  projectTechStack.forEach((tech: string) => {
    if (providerSkills.some((skill: string) => skill.includes(tech.toLowerCase()) || tech.toLowerCase().includes(skill))) {
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
    reasons.push("General expertise match");
  }

  // Experience level suitability (15 points)
  const complexityExperienceMap: Record<string, string[]> = {
    'simple': ['entry-level', 'intermediate', 'senior', 'expert'],
    'medium': ['intermediate', 'senior', 'expert'],
    'complex': ['senior', 'expert']
  };
  
  const suitableExperience = complexityExperienceMap[project.complexity || 'medium'] || [];
  if (suitableExperience.includes(provider.experience)) {
    score += 15;
    reasons.push(`Suitable for ${project.complexity || 'medium'} complexity`);
  } else if (provider.experience === 'expert') {
    // Experts can do any complexity, but might be overqualified for simple tasks
    score += project.complexity === 'simple' ? 10 : 15;
    reasons.push(project.complexity === 'simple' ? "Overqualified but capable" : "Expert level suitable");
  }

  // Budget attractiveness (15 points)
  if (project.budget && provider.hourlyRate) {
    // Estimate project hours based on complexity
    const estimatedHours = project.complexity === 'simple' ? 20 : 
                          project.complexity === 'complex' ? 100 : 50;
    const potentialEarnings = provider.hourlyRate * estimatedHours;
    
    // Score based on how much of budget can be earned
    if (potentialEarnings <= project.budget) {
      const budgetUtilization = potentialEarnings / project.budget;
      const budgetScore = Math.round(budgetUtilization * 15);
      score += Math.max(budgetScore, 5); // Minimum 5 points if within budget
      reasons.push(`$${project.budget.toLocaleString()} budget available`);
    } else {
      // Still award some points if close
      const ratio = project.budget / potentialEarnings;
      if (ratio > 0.8) {
        score += 8;
        reasons.push("Budget slightly tight but viable");
      }
    }
  } else if (project.budget && !provider.hourlyRate) {
    score += 10;
    reasons.push(`$${project.budget.toLocaleString()} budget available`);
  }

  // Timeline compatibility (10 points)
  const timelineAvailabilityMap: Record<string, string[]> = {
    'asap': ['immediate'],
    'within_week': ['immediate', 'within_week'],
    'within_month': ['immediate', 'within_week', 'within_month'],
    'flexible': ['immediate', 'within_week', 'within_month', 'flexible']
  };
  
  const timelineCompatible = timelineAvailabilityMap[project.timeline || 'flexible'] || [];
  if (timelineCompatible.includes(provider.availability)) {
    score += 10;
    reasons.push(`Timeline matches your availability`);
  }

  // Competition level (5 points)
  // Fewer existing matches = higher score
  const competitionScore = Math.max(5 - project.matchCount, 1);
  score += competitionScore;
  if (project.matchCount === 0) {
    reasons.push("No competition yet");
  } else if (project.matchCount < 3) {
    reasons.push("Low competition");
  }

  // Freshness bonus - newer projects get slight boost
  const daysSincePosted = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSincePosted < 7) {
    score += 3;
    reasons.push("Recently posted");
  }

  return {
    project,
    score: Math.min(score, maxScore),
    reasons
  };
}

export async function GET(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const minScore = parseInt(searchParams.get('minScore') || '25');

    // Get the current user's service provider profile
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        roles: true,
        serviceTypes: true,
        skills: true,
        experience: true,
        hourlyRate: true,
        availability: true,
        remoteOk: true
      }
    });

    if (!currentUser || !currentUser.roles.includes('service_provider')) {
      return NextResponse.json({ 
        message: 'Service provider profile required' 
      }, { status: 403 });
    }

    // Get open projects, prioritizing those matching provider's service types
    const projects = await prisma.project.findMany({
      where: {
        status: 'open',
        // Exclude projects where provider already applied
        matches: {
          none: {
            serviceProviderId: currentUser.id
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            title: true,
            location: true
          }
        },
        matches: {
          select: { id: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform projects and add match count
    const projectsWithMatchCount = projects.map(project => ({
      ...project,
      matchCount: project.matches.length
    }));

    // Calculate match scores
    const matches: ProjectMatch[] = projectsWithMatchCount
      .map(project => calculateProviderProjectMatch(currentUser, project))
      .filter(match => match.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return NextResponse.json({
      provider: {
        serviceTypes: currentUser.serviceTypes,
        skills: currentUser.skills ? currentUser.skills.split(',').map(s => s.trim()) : [],
        experience: currentUser.experience,
        availability: currentUser.availability
      },
      suggestedProjects: matches.map(match => ({
        project: {
          id: match.project.id,
          title: match.project.title,
          description: match.project.description,
          serviceType: match.project.serviceType,
          budget: match.project.budget,
          timeline: match.project.timeline,
          complexity: match.project.complexity,
          techStack: match.project.techStack,
          requirements: match.project.requirements,
          createdAt: match.project.createdAt,
          owner: match.project.owner,
          matchCount: match.project.matchCount
        },
        matchScore: match.score,
        matchReasons: match.reasons
      })),
      totalFound: matches.length
    });

  } catch (error) {
    console.error('Error finding suggested projects:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}