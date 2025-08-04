import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database schema...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Test if User table exists by running a simple query
    try {
      const userCount = await prisma.user.count();
      console.log('✅ User table exists, count:', userCount);
      
      // Test if the openaiApiKey field exists
      const userWithApiKey = await prisma.user.findFirst({
        select: { id: true, email: true, openaiApiKey: true }
      });
      console.log('✅ openaiApiKey field exists');
      
      return NextResponse.json({
        status: 'success',
        database: 'connected',
        userTable: 'exists',
        userCount,
        openaiApiKeyField: 'exists',
        sampleUser: userWithApiKey ? {
          id: userWithApiKey.id,
          email: userWithApiKey.email,
          hasApiKey: !!userWithApiKey.openaiApiKey
        } : null,
        timestamp: new Date().toISOString(),
      });

    } catch (tableError) {
      console.error('💥 Schema/table error:', tableError);
      
      return NextResponse.json({
        status: 'schema_error',
        database: 'connected',
        error: 'Schema or table issue',
        details: {
          message: tableError instanceof Error ? tableError.message : 'Unknown table error',
          code: (tableError as any)?.code,
          meta: (tableError as any)?.meta
        },
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

  } catch (connectionError) {
    console.error('💥 Database connection error:', connectionError);
    
    return NextResponse.json({
      status: 'connection_error',
      database: 'disconnected',
      error: 'Database connection failed',
      details: {
        message: connectionError instanceof Error ? connectionError.message : 'Unknown connection error',
        code: (connectionError as any)?.code,
        meta: (connectionError as any)?.meta
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}