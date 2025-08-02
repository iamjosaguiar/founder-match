import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/businesses/[id] - Get specific business
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
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

    const business = await prisma.business.findFirst({
      where: { 
        id: resolvedParams.id,
        userId: user.id,
        isActive: true
      }
    });

    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ business });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/businesses/[id] - Update business
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
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

    // Verify business ownership
    const existingBusiness = await prisma.business.findFirst({
      where: { 
        id: resolvedParams.id,
        userId: user.id,
        isActive: true
      }
    });

    if (!existingBusiness) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    const business = await prisma.business.update({
      where: { id: resolvedParams.id },
      data: {
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

    return NextResponse.json({ business });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/businesses/[id] - Soft delete business
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, currentBusinessId: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: { 
        id: resolvedParams.id,
        userId: user.id,
        isActive: true
      }
    });

    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    // Soft delete the business
    await prisma.business.update({
      where: { id: resolvedParams.id },
      data: { isActive: false }
    });

    // If this was the current business, clear the current business selection
    if (user.currentBusinessId === resolvedParams.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { currentBusinessId: null }
      });
    }

    return NextResponse.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}