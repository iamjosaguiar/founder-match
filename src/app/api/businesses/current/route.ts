import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/businesses/current - Set current business
export async function PUT(request: NextRequest) {
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

    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json({ message: 'businessId is required' }, { status: 400 });
    }

    // Verify the business belongs to the user
    const business = await prisma.business.findFirst({
      where: { 
        id: businessId,
        userId: user.id,
        isActive: true
      }
    });

    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    // Update the user's current business
    await prisma.user.update({
      where: { id: user.id },
      data: { currentBusinessId: businessId }
    });

    return NextResponse.json({ 
      message: 'Current business updated successfully',
      currentBusinessId: businessId
    });
  } catch (error) {
    console.error('Error setting current business:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}