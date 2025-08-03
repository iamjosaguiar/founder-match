import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { 
      name, title, bio, location, serviceTypes, skills, experience,
      hourlyRate, availability, remoteOk, portfolio 
    } = await request.json();

    // Validate required fields
    if (!name || !title || !bio || !serviceTypes || serviceTypes.length === 0 || 
        !skills || !experience || !hourlyRate || !availability) {
      return NextResponse.json({ 
        message: 'All required fields must be provided' 
      }, { status: 400 });
    }

    // Get current user to check existing roles
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { roles: true }
    });

    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Add service_provider to roles if not already present
    let currentRoles: string[] = [];
    try {
      currentRoles = JSON.parse(currentUser.roles);
    } catch {
      currentRoles = ['founder']; // Default fallback
    }
    
    const updatedRoles = currentRoles.includes('service_provider') 
      ? currentRoles 
      : [...currentRoles, 'service_provider'];

    // Update user with service provider data
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        title,
        bio,
        location,
        roles: JSON.stringify(updatedRoles),
        serviceTypes: JSON.stringify(serviceTypes),
        skills: skills, // Already comma-separated from frontend
        experience,
        hourlyRate: parseInt(hourlyRate),
        availability,
        remoteOk: remoteOk || false,
        portfolio: portfolio, // JSON string from frontend
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        title: true,
        roles: true,
        serviceTypes: true,
      }
    });

    return NextResponse.json({ 
      message: 'Service provider profile created successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Service provider registration error:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}