import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');
    const skills = searchParams.get('skills');
    const experience = searchParams.get('experience');
    const availability = searchParams.get('availability');
    const remoteOk = searchParams.get('remoteOk');
    const minRate = searchParams.get('minRate');
    const maxRate = searchParams.get('maxRate');
    
    const where: any = {
      roles: {
        has: 'service_provider'
      },
      // Only show providers with complete profiles
      name: { not: null },
      title: { not: null },
      bio: { not: null },
      serviceTypes: { isEmpty: false }
    };
    
    if (serviceType && serviceType !== 'all') {
      where.serviceTypes = { has: serviceType };
    }
    
    if (skills) {
      // Search for providers with matching skills (case insensitive)
      where.skills = {
        contains: skills,
        mode: 'insensitive'
      };
    }
    
    if (experience && experience !== 'all') {
      where.experience = experience;
    }
    
    if (availability && availability !== 'all') {
      where.availability = availability;
    }
    
    if (remoteOk === 'true') {
      where.remoteOk = true;
    }
    
    if (minRate) {
      where.hourlyRate = { gte: parseInt(minRate) };
    }
    
    if (maxRate) {
      if (where.hourlyRate) {
        where.hourlyRate.lte = parseInt(maxRate);
      } else {
        where.hourlyRate = { lte: parseInt(maxRate) };
      }
    }
    
    const serviceProviders = await prisma.user.findMany({
      where,
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
        createdAt: true,
        // Include some aggregate stats
        projectMatches: {
          select: {
            status: true
          }
        }
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Transform the data to include calculated fields
    const transformedProviders = serviceProviders.map(provider => ({
      ...provider,
      skills: provider.skills ? provider.skills.split(',').map(s => s.trim()) : [],
      portfolio: provider.portfolio ? JSON.parse(provider.portfolio) : [],
      completedProjects: provider.projectMatches.filter(m => m.status === 'completed').length,
      totalProjects: provider.projectMatches.length
    }));

    return NextResponse.json(transformedProviders);
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}