import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export type FounderAssessmentData = {
  // Section 1: Founder Identity & Work Style
  motivation: string;
  founderPersonality: string;
  pressureResponse: string;
  conflictHandling: string;
  communicationStyle: string;
  bigFiveData?: any; // Optional personality data
  
  // Section 2: Vision, Commitment & Ambition
  longTermVision: string;
  idealExit: string;
  weeklyCommitment: number;
  fullTimeReady: boolean;
  noPayCommitment: boolean;
  locationFlexible: boolean;
  riskAppetite: number;
  
  // Section 3: Skills, Strengths & Role Fit
  topSkills: string[]; // Will be JSON stringified
  weakAreas: string;
  preferredRoles: string[]; // Will be JSON stringified
  technicalLevel: string;
  portfolioLinks?: any; // Optional portfolio data
  biggestAchievement: string;
  
  // Section 4: Startup Stage & Domain Fit
  currentStage: string;
  lookingToJoin: string;
  passionateIndustries: string[]; // Will be JSON stringified
  domainExperience: boolean;
  previousStartupExp: boolean;
  
  // Section 5: Work Culture & Operating Style
  workingStyle: string;
  workPreference: string;
  timezoneFlexibility: string;
  meetingRhythm: string;
  collaborationScale: number;
  
  // Section 6: Conflict, Equity & Red Flags
  scenarioResponse: string;
  equityExpectation: string;
  dealbreakers: string[]; // Will be JSON stringified
  previousCofounderExp: string;
  
  // Section 7: Optional Psychometrics
  psychometricData?: any;
};

function calculateFounderProfile(data: FounderAssessmentData) {
  // Generate a founder profile based on assessment responses
  const profile = {
    // Leadership style based on personality and pressure response
    leadershipStyle: data.founderPersonality === 'Visionary' ? 'inspirational' :
                    data.founderPersonality === 'Operator' ? 'execution-focused' :
                    data.founderPersonality === 'Strategist' ? 'analytical' : 'collaborative',
    
    // Risk profile
    riskProfile: data.riskAppetite >= 8 ? 'high-risk' : 
                data.riskAppetite >= 5 ? 'balanced-risk' : 'conservative',
    
    // Communication preference
    communicationPreference: data.communicationStyle,
    
    // Work style preference
    workStylePreference: data.workPreference,
    
    // Commitment level
    commitmentLevel: data.fullTimeReady && data.noPayCommitment ? 'high' : 
                    data.fullTimeReady ? 'medium' : 'flexible',
    
    // Stage readiness
    stageReadiness: data.currentStage,
    
    // Role focus
    roleFocus: data.preferredRoles,
    
    // Founder archetype
    founderType: generateFounderArchetype(data),
  };

  return profile;
}

function generateFounderArchetype(data: FounderAssessmentData): string {
  // Determine founder archetype based on assessment combination
  if (data.founderPersonality === 'Visionary' && data.riskAppetite >= 7) {
    return 'Visionary Risk-Taker';
  } else if (data.founderPersonality === 'Operator' && data.technicalLevel === 'Technical') {
    return 'Technical Operator';
  } else if (data.founderPersonality === 'Strategist' && data.previousStartupExp) {
    return 'Serial Strategist';
  } else if (data.founderPersonality === 'Craftsman' && data.domainExperience) {
    return 'Domain Expert';
  } else if (data.longTermVision === 'Billion-dollar' && data.fullTimeReady) {
    return 'Scale-Focused Builder';
  } else if (data.longTermVision === 'Lifestyle' && data.workingStyle === 'Remote') {
    return 'Lifestyle Entrepreneur';
  } else {
    return 'Balanced Founder';
  }
}

export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data: FounderAssessmentData = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'motivation', 'founderPersonality', 'pressureResponse', 'conflictHandling',
      'communicationStyle', 'longTermVision', 'idealExit', 'weeklyCommitment',
      'fullTimeReady', 'noPayCommitment', 'locationFlexible', 'riskAppetite',
      'topSkills', 'weakAreas', 'preferredRoles', 'technicalLevel', 
      'biggestAchievement', 'currentStage', 'lookingToJoin', 'passionateIndustries',
      'domainExperience', 'previousStartupExp', 'workingStyle', 'workPreference',
      'timezoneFlexibility', 'meetingRhythm', 'collaborationScale',
      'scenarioResponse', 'equityExpectation', 'dealbreakers', 'previousCofounderExp'
    ];
    
    for (const field of requiredFields) {
      if (data[field as keyof FounderAssessmentData] === undefined || 
          data[field as keyof FounderAssessmentData] === null ||
          data[field as keyof FounderAssessmentData] === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate numeric ranges
    if (data.weeklyCommitment < 0 || data.weeklyCommitment > 168) {
      return NextResponse.json(
        { error: 'Weekly commitment must be between 0 and 168 hours' },
        { status: 400 }
      );
    }
    
    if (data.riskAppetite < 1 || data.riskAppetite > 10) {
      return NextResponse.json(
        { error: 'Risk appetite must be between 1 and 10' },
        { status: 400 }
      );
    }
    
    if (data.collaborationScale < 1 || data.collaborationScale > 10) {
      return NextResponse.json(
        { error: 'Collaboration scale must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Generate founder profile from assessment
    const founderProfile = calculateFounderProfile(data);
    
    // Update the authenticated user with assessment results
    const user = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        assessmentCompleted: true,
        
        // Section 1: Founder Identity & Work Style
        motivation: data.motivation,
        founderPersonality: data.founderPersonality,
        pressureResponse: data.pressureResponse,
        conflictHandling: data.conflictHandling,
        communicationStyle: data.communicationStyle,
        bigFiveData: data.bigFiveData || null,
        
        // Section 2: Vision, Commitment & Ambition
        longTermVision: data.longTermVision,
        idealExit: data.idealExit,
        weeklyCommitment: data.weeklyCommitment,
        fullTimeReady: data.fullTimeReady,
        noPayCommitment: data.noPayCommitment,
        locationFlexible: data.locationFlexible,
        riskAppetite: data.riskAppetite,
        
        // Section 3: Skills, Strengths & Role Fit
        topSkills: JSON.stringify(data.topSkills),
        weakAreas: data.weakAreas,
        preferredRoles: JSON.stringify(data.preferredRoles),
        technicalLevel: data.technicalLevel,
        portfolioLinks: data.portfolioLinks ? JSON.stringify(data.portfolioLinks) : null,
        biggestAchievement: data.biggestAchievement,
        
        // Section 4: Startup Stage & Domain Fit
        currentStage: data.currentStage,
        lookingToJoin: data.lookingToJoin,
        passionateIndustries: JSON.stringify(data.passionateIndustries),
        domainExperience: data.domainExperience,
        previousStartupExp: data.previousStartupExp,
        
        // Section 5: Work Culture & Operating Style
        workingStyle: data.workingStyle,
        workPreference: data.workPreference,
        timezoneFlexibility: data.timezoneFlexibility,
        meetingRhythm: data.meetingRhythm,
        collaborationScale: data.collaborationScale,
        
        // Section 6: Conflict, Equity & Red Flags
        scenarioResponse: data.scenarioResponse,
        equityExpectation: data.equityExpectation,
        dealbreakers: JSON.stringify(data.dealbreakers),
        previousCofounderExp: data.previousCofounderExp,
        
        // Section 7: Optional Psychometrics
        psychometricData: data.psychometricData || null,
        
        // Update calculated profile
        personalityProfile: founderProfile,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      profile: founderProfile,
      message: 'Founder assessment completed successfully'
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process assessment submission' },
      { status: 500 }
    );
  }
}