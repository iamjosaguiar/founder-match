import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Database health check starting...');
    console.log('🔍 Environment:', {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...'
    });

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log('✅ User count query successful:', userCount);

    // Test specific user lookup (if any users exist)
    if (userCount > 0) {
      const firstUser = await prisma.user.findFirst({
        select: { id: true, email: true, name: true }
      });
      console.log('✅ User lookup successful:', firstUser?.email);
    }

    await prisma.$disconnect();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('💥 Database health check failed:', error);
    console.error('💥 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      code: (error as any)?.code,
    });

    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? {
          stack: error instanceof Error ? error.stack : undefined,
          code: (error as any)?.code,
        } : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}