import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/businesses - Get all businesses for current user
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const businesses = await prisma.business.findMany({
      where: { 
        userId: user.id,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/businesses - Create new business
export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const businessData = await request.json();

    // Validate required fields
    if (!businessData.name || !businessData.industry || !businessData.businessType || !businessData.stage) {
      return NextResponse.json({ 
        message: 'Missing required fields: name, industry, businessType, stage' 
      }, { status: 400 });
    }

    const business = await prisma.business.create({
      data: {
        userId: user.id,
        name: businessData.name,
        description: businessData.description,
        industry: businessData.industry,
        businessType: businessData.businessType,
        subType: businessData.subType,
        location: businessData.location,
        country: businessData.country,
        targetMarket: businessData.targetMarket,
        targetAudience: businessData.targetAudience,
        stage: businessData.stage,
        foundedYear: businessData.foundedYear ? parseInt(businessData.foundedYear) : null,
        teamSize: businessData.teamSize ? parseInt(businessData.teamSize) : null,
        revenueRange: businessData.revenueRange,
        businessModel: businessData.businessModel,
        revenueModel: businessData.revenueModel,
        pricePoint: businessData.pricePoint,
        website: businessData.website,
        socialMedia: businessData.socialMedia,
        primaryServices: businessData.primaryServices,
        specialties: businessData.specialties,
        mainCompetitors: businessData.mainCompetitors,
        marketPosition: businessData.marketPosition,
        shortTermGoals: businessData.shortTermGoals,
        longTermVision: businessData.longTermVision
      }
    });

    // If this is the user's first business, set it as current
    const businessCount = await prisma.business.count({
      where: { userId: user.id, isActive: true }
    });

    if (businessCount === 1) {
      await prisma.user.update({
        where: { id: user.id },
        data: { currentBusinessId: business.id }
      });
    }

    return NextResponse.json({ business }, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}