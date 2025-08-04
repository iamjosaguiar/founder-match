import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Adding openaiApiKey column to existing User table...');
    
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check if User table exists and get count
    const userCount = await prisma.user.count();
    console.log(`✅ User table exists with ${userCount} users`);

    // Add the openaiApiKey column using raw SQL
    console.log('🔄 Adding openaiApiKey column...');
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "openaiApiKey" TEXT;`;
    console.log('✅ openaiApiKey column added successfully');

    // Verify the column was added by trying to select it
    console.log('🔍 Verifying column was added...');
    const testQuery = await prisma.user.findFirst({
      select: { 
        id: true, 
        email: true, 
        openaiApiKey: true 
      }
    });
    console.log('✅ Column verification successful');

    return NextResponse.json({
      success: true,
      message: 'openaiApiKey column added successfully to User table',
      details: {
        userCount,
        columnAdded: 'openaiApiKey',
        tableUpdated: 'User',
        verified: true,
        sampleUser: testQuery ? {
          id: testQuery.id,
          email: testQuery.email,
          hasApiKey: !!testQuery.openaiApiKey
        } : null
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('💥 Column addition failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to add openaiApiKey column',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        meta: (error as any)?.meta
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}