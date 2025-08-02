import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check environment variables
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        database: 'connected',
        nextauth_secret: hasNextAuthSecret ? 'configured' : 'missing',
        nextauth_url: hasNextAuthUrl ? 'configured' : 'missing',
        database_url: hasDbUrl ? 'configured' : 'missing',
        openai_key: hasOpenAI ? 'configured' : 'missing'
      }
    };
    
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}