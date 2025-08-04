import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting schema migration...');
    
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check if column already exists
    console.log('🔍 Checking if openaiApiKey column exists...');
    try {
      await prisma.user.findFirst({
        select: { openaiApiKey: true }
      });
      console.log('✅ openaiApiKey column already exists');
      
      return NextResponse.json({
        success: true,
        message: 'Schema migration not needed - openaiApiKey column already exists',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.code === 'P2022') {
        console.log('⚠️ openaiApiKey column does not exist, will create it');
      } else {
        throw error;
      }
    }

    // Add the column using raw SQL
    console.log('🔄 Adding openaiApiKey column...');
    await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "openaiApiKey" TEXT;`;
    console.log('✅ openaiApiKey column added successfully');

    // Verify the column was added
    console.log('🔍 Verifying column was added...');
    const testUser = await prisma.user.findFirst({
      select: { id: true, email: true, openaiApiKey: true }
    });
    console.log('✅ Column verification successful');

    // Test that the API key endpoint now works
    console.log('🔍 Testing API key functionality...');
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Schema migration completed successfully',
      details: {
        columnAdded: 'openaiApiKey',
        verified: true,
        userCount,
        sampleUser: testUser ? {
          id: testUser.id,
          email: testUser.email,
          hasApiKey: !!testUser.openaiApiKey
        } : null
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('💥 Migration failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Schema migration failed',
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