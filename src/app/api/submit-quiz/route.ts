import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type QuizData = {
  openness1: number;
  openness2: number;
  conscientiousness1: number;
  conscientiousness2: number;
  extraversion1: number;
  extraversion2: number;
  agreeableness1: number;
  agreeableness2: number;
  neuroticism1: number;
  neuroticism2: number;
  riskTolerance1: number;
  riskTolerance2: number;
};

function calculatePersonalityScores(data: QuizData) {
  // Calculate average scores for each trait (1-5 scale)
  const openness = (data.openness1 + data.openness2) / 2;
  const conscientiousness = (data.conscientiousness1 + data.conscientiousness2) / 2;
  const extraversion = (data.extraversion1 + data.extraversion2) / 2;
  const agreeableness = (data.agreeableness1 + data.agreeableness2) / 2;
  
  // Neuroticism questions are reverse-scored (higher values = more emotionally stable)
  const emotionalStability = (data.neuroticism1 + data.neuroticism2) / 2;
  const neuroticism = 6 - emotionalStability; // Convert to traditional neuroticism score
  
  const riskTolerance = (data.riskTolerance1 + data.riskTolerance2) / 2;

  return {
    openness: Math.round(openness * 10) / 10,
    conscientiousness: Math.round(conscientiousness * 10) / 10,
    extraversion: Math.round(extraversion * 10) / 10,
    agreeableness: Math.round(agreeableness * 10) / 10,
    neuroticism: Math.round(neuroticism * 10) / 10,
    emotionalStability: Math.round(emotionalStability * 10) / 10,
    riskTolerance: Math.round(riskTolerance * 10) / 10,
  };
}

function generateCompatibilityProfile(scores: ReturnType<typeof calculatePersonalityScores>) {
  // Generate a compatibility profile that can be used for matching
  // This is a simplified version - in production you'd want more sophisticated algorithms
  
  const profile = {
    // Leadership style based on extraversion and conscientiousness
    leadershipStyle: scores.extraversion > 3.5 && scores.conscientiousness > 3.5 
      ? 'directive' 
      : scores.extraversion > 3.5 
        ? 'collaborative' 
        : 'supportive',
    
    // Innovation preference based on openness
    innovationPreference: scores.openness > 3.5 ? 'high' : scores.openness > 2.5 ? 'medium' : 'low',
    
    // Risk profile
    riskProfile: scores.riskTolerance > 3.5 
      ? 'risk-seeking' 
      : scores.riskTolerance > 2.5 
        ? 'balanced' 
        : 'risk-averse',
    
    // Communication style
    communicationStyle: scores.extraversion > 3.5 && scores.agreeableness > 3.5
      ? 'expressive'
      : scores.agreeableness > 3.5
        ? 'diplomatic'
        : 'direct',
    
    // Work style
    workStyle: scores.conscientiousness > 3.5
      ? 'structured'
      : 'flexible',
    
    // Stress handling
    stressHandling: scores.emotionalStability > 3.5 ? 'resilient' : 'sensitive',
    
    // Overall founder type
    founderType: getFounderType(scores),
  };

  return profile;
}

function getFounderType(scores: ReturnType<typeof calculatePersonalityScores>): string {
  // Determine founder archetype based on personality combination
  if (scores.extraversion > 3.5 && scores.openness > 3.5 && scores.riskTolerance > 3.5) {
    return 'visionary-leader';
  } else if (scores.conscientiousness > 3.5 && scores.extraversion > 3.5) {
    return 'operational-leader';
  } else if (scores.openness > 3.5 && scores.conscientiousness > 3.5) {
    return 'strategic-builder';
  } else if (scores.agreeableness > 3.5 && scores.extraversion > 3.5) {
    return 'people-leader';
  } else if (scores.openness > 3.5 && scores.riskTolerance > 3.5) {
    return 'innovator';
  } else if (scores.conscientiousness > 3.5 && scores.emotionalStability > 3.5) {
    return 'executor';
  } else {
    return 'balanced-founder';
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

    const data: QuizData = await req.json();
    
    // Validate that all required fields are present and within range
    const requiredFields = [
      'openness1', 'openness2', 'conscientiousness1', 'conscientiousness2',
      'extraversion1', 'extraversion2', 'agreeableness1', 'agreeableness2',
      'neuroticism1', 'neuroticism2', 'riskTolerance1', 'riskTolerance2'
    ];
    
    for (const field of requiredFields) {
      const value = data[field as keyof QuizData];
      if (!value || value < 1 || value > 5) {
        return NextResponse.json(
          { error: `Invalid value for ${field}. Must be between 1 and 5.` },
          { status: 400 }
        );
      }
    }

    // Calculate personality scores
    const personalityScores = calculatePersonalityScores(data);
    
    // Generate compatibility profile
    const compatibilityProfile = generateCompatibilityProfile(personalityScores);
    
    // Update the authenticated user with quiz results
    const user = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        quizCompleted: true,
        quizScores: personalityScores,
        personalityProfile: compatibilityProfile,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      scores: personalityScores,
      profile: compatibilityProfile,
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz submission' },
      { status: 500 }
    );
  }
}