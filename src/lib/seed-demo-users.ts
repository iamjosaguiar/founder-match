import { prisma } from './prisma';

const demoUsers = [
  {
    email: 'sarah.chen@example.com',
    name: 'Sarah Chen',
    title: 'Tech Entrepreneur',
    bio: 'Former Google PM building the next generation of AI-powered productivity tools. Looking for a technical co-founder with ML expertise.',
    skills: 'Product Management,AI/ML,Strategy,Fundraising',
    experience: 'experienced',
    lookingFor: 'Technical co-founder with ML/AI background',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b188?w=400&h=400&fit=crop&crop=face',
    industry: 'AI/ML',
    stage: 'Building MVP',
    location: 'San Francisco',
    remoteOk: true,
    timeCommitment: 'Full-time',
    fundingStatus: 'Seeking Seed',
    companyGoals: 'Scale Nationally',
    workStyle: 'Somewhat Structured',
    isTechnical: false,
    quizCompleted: true,
    quizScores: {
      openness: 4.5,
      conscientiousness: 4.2,
      extraversion: 3.8,
      agreeableness: 4.0,
      neuroticism: 2.1,
      emotionalStability: 3.9,
      riskTolerance: 4.3,
    },
    personalityProfile: {
      leadershipStyle: 'directive',
      innovationPreference: 'high',
      riskProfile: 'risk-seeking',
      communicationStyle: 'expressive',
      workStyle: 'structured',
      stressHandling: 'resilient',
      founderType: 'visionary-leader',
    },
  },
  {
    email: 'marcus.rodriguez@example.com',
    name: 'Marcus Rodriguez',
    title: 'Full-Stack Developer',
    bio: 'Senior engineer with 8 years at startups. Built and scaled platforms to 1M+ users. Ready to start my own company in fintech.',
    skills: 'React,Node.js,AWS,PostgreSQL,Docker',
    experience: 'first-time',
    lookingFor: 'Business-minded co-founder with domain expertise',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    industry: 'Fintech',
    stage: 'Idea Stage',
    location: 'Austin',
    remoteOk: true,
    timeCommitment: 'Full-time',
    fundingStatus: 'Bootstrapped',
    companyGoals: 'Regional Success',
    workStyle: 'Flexible',
    isTechnical: true,
    quizCompleted: true,
    quizScores: {
      openness: 3.8,
      conscientiousness: 4.5,
      extraversion: 2.9,
      agreeableness: 3.7,
      neuroticism: 2.3,
      emotionalStability: 3.7,
      riskTolerance: 3.2,
    },
    personalityProfile: {
      leadershipStyle: 'supportive',
      innovationPreference: 'medium',
      riskProfile: 'balanced',
      communicationStyle: 'diplomatic',
      workStyle: 'structured',
      stressHandling: 'resilient',
      founderType: 'executor',
    },
  },
  {
    email: 'emily.johnson@example.com',
    name: 'Emily Johnson',
    title: 'Marketing Executive',
    bio: 'Growth marketing expert who scaled 3 startups to $10M+ ARR. Specialized in B2B SaaS go-to-market strategies.',
    skills: 'Growth Marketing,B2B Sales,Analytics,Content Strategy',
    experience: 'serial',
    lookingFor: 'Technical co-founder for B2B SaaS product',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    industry: 'SaaS',
    stage: 'Early Revenue',
    location: 'New York',
    remoteOk: false,
    timeCommitment: 'Full-time',
    fundingStatus: 'Series A+',
    companyGoals: 'Global Unicorn',
    workStyle: 'Somewhat Structured',
    isTechnical: false,
    quizCompleted: true,
    quizScores: {
      openness: 4.1,
      conscientiousness: 3.9,
      extraversion: 4.4,
      agreeableness: 4.2,
      neuroticism: 1.8,
      emotionalStability: 4.2,
      riskTolerance: 3.9,
    },
    personalityProfile: {
      leadershipStyle: 'collaborative',
      innovationPreference: 'high',
      riskProfile: 'balanced',
      communicationStyle: 'expressive',
      workStyle: 'flexible',
      stressHandling: 'resilient',
      founderType: 'people-leader',
    },
  },
  {
    email: 'david.kim@example.com',
    name: 'David Kim',
    title: 'Design & Strategy Lead',
    bio: 'Former design director at Stripe and Figma. Expert in product design and user experience. Building tools to democratize design.',
    skills: 'Product Design,UX Research,Strategy,Branding',
    experience: 'experienced',
    lookingFor: 'Technical co-founder for design platform',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    industry: 'SaaS',
    stage: 'Building MVP',
    location: 'Seattle',
    remoteOk: true,
    timeCommitment: 'Full-time',
    fundingStatus: 'Seeking Pre-seed',
    companyGoals: 'Scale Nationally',
    workStyle: 'Flexible',
    isTechnical: false,
    quizCompleted: true,
    quizScores: {
      openness: 4.7,
      conscientiousness: 4.1,
      extraversion: 3.5,
      agreeableness: 4.3,
      neuroticism: 2.2,
      emotionalStability: 3.8,
      riskTolerance: 3.8,
    },
    personalityProfile: {
      leadershipStyle: 'collaborative',
      innovationPreference: 'high',
      riskProfile: 'balanced',
      communicationStyle: 'diplomatic',
      workStyle: 'flexible',
      stressHandling: 'resilient',
      founderType: 'strategic-builder',
    },
  },
  {
    email: 'priya.patel@example.com',
    name: 'Priya Patel',
    title: 'Biotech Entrepreneur',
    bio: 'PhD in Bioengineering from Stanford. Former researcher at Genentech. Developing next-gen therapeutics for rare diseases.',
    skills: 'Biotech,Research,Regulatory,Fundraising',
    experience: 'first-time',
    lookingFor: 'Business co-founder with pharma experience',
    profileImage: 'https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=400&h=400&fit=crop&crop=face',
    industry: 'Healthcare',
    stage: 'Idea Stage',
    location: 'Boston',
    remoteOk: false,
    timeCommitment: 'Full-time',
    fundingStatus: 'Seeking Seed',
    companyGoals: 'Global Unicorn',
    workStyle: 'Highly Structured',
    isTechnical: true,
    quizCompleted: true,
    quizScores: {
      openness: 4.2,
      conscientiousness: 4.8,
      extraversion: 3.2,
      agreeableness: 4.1,
      neuroticism: 2.0,
      emotionalStability: 4.0,
      riskTolerance: 3.6,
    },
    personalityProfile: {
      leadershipStyle: 'supportive',
      innovationPreference: 'high',
      riskProfile: 'balanced',
      communicationStyle: 'diplomatic',
      workStyle: 'structured',
      stressHandling: 'resilient',
      founderType: 'strategic-builder',
    },
  },
  {
    email: 'alex.johnson@example.com',
    name: 'Alex Johnson',
    title: 'Climate Tech Founder',
    bio: 'Former Tesla engineer building carbon capture solutions. MIT grad with patents in clean energy. Ready to scale impact.',
    skills: 'Engineering,Climate Tech,Manufacturing,Operations',
    experience: 'serial',
    lookingFor: 'Business co-founder for climate startup',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    industry: 'Energy',
    stage: 'Early Revenue',
    location: 'Austin',
    remoteOk: true,
    timeCommitment: 'Full-time',
    fundingStatus: 'Series A+',
    companyGoals: 'Global Unicorn',
    workStyle: 'Somewhat Structured',
    isTechnical: true,
    quizCompleted: true,
    quizScores: {
      openness: 4.6,
      conscientiousness: 4.0,
      extraversion: 4.1,
      agreeableness: 3.9,
      neuroticism: 1.9,
      emotionalStability: 4.1,
      riskTolerance: 4.4,
    },
    personalityProfile: {
      leadershipStyle: 'directive',
      innovationPreference: 'high',
      riskProfile: 'risk-seeking',
      communicationStyle: 'direct',
      workStyle: 'flexible',
      stressHandling: 'resilient',
      founderType: 'visionary-leader',
    },
  },
];

export async function seedDemoUsers() {
  try {
    for (const userData of demoUsers) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: userData,
        create: userData,
      });
    }
    console.log('Demo users seeded successfully');
  } catch (error) {
    console.error('Error seeding demo users:', error);
  }
}