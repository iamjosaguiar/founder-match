import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting full schema initialization...');
    
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check if User table exists
    try {
      const userCount = await prisma.user.count();
      console.log('✅ User table already exists with', userCount, 'users');
      
      // Check if openaiApiKey column exists
      try {
        await prisma.user.findFirst({
          select: { openaiApiKey: true }
        });
        console.log('✅ openaiApiKey column already exists');
        
        return NextResponse.json({
          success: true,
          message: 'Schema already exists - no migration needed',
          userCount,
          timestamp: new Date().toISOString(),
        });
      } catch (columnError: any) {
        if (columnError.code === 'P2022') {
          console.log('⚠️ User table exists but openaiApiKey column missing, adding it...');
          await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "openaiApiKey" TEXT;`;
          console.log('✅ openaiApiKey column added to existing table');
          
          return NextResponse.json({
            success: true,
            message: 'Added openaiApiKey column to existing User table',
            userCount,
            timestamp: new Date().toISOString(),
          });
        }
        throw columnError;
      }
      
    } catch (tableError: any) {
      if (tableError.code === 'P2021' || tableError.code === 'P2010' || tableError.meta?.code === '42P01') {
        console.log('⚠️ User table does not exist, will use Prisma to create schema');
      } else {
        throw tableError;
      }
    }

    // Use Prisma's push functionality to create the complete schema
    console.log('🔄 Creating complete database schema using Prisma...');
    
    // Since we can't directly call db push from here, we'll use a raw SQL approach
    // to create the User table with all necessary fields
    console.log('🔄 Creating User table...');
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "profileImage" TEXT,
        "password" TEXT,
        "roles" TEXT NOT NULL DEFAULT '["founder"]',
        "founderJourney" TEXT,
        "title" TEXT,
        "bio" TEXT,
        "skills" TEXT,
        "experience" TEXT,
        "lookingFor" TEXT,
        "projectLinks" TEXT,
        "openaiApiKey" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('✅ User table created');

    // Create indexes
    console.log('🔄 Creating indexes...');
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`;
    
    // Verify the table was created
    const userCount = await prisma.user.count();
    console.log('✅ Schema creation verified, user count:', userCount);

    // Test that we can query the openaiApiKey field
    const testUser = await prisma.user.findFirst({
      select: { id: true, email: true, openaiApiKey: true }
    });
    console.log('✅ openaiApiKey field verification successful');

    return NextResponse.json({
      success: true,
      message: 'Complete database schema created successfully',
      details: {
        tableCreated: 'User',
        columnsIncluded: ['id', 'email', 'name', 'openaiApiKey', 'password', 'roles', 'etc'],
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
    console.error('💥 Schema initialization failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Schema initialization failed',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        meta: (error as any)?.meta,
        stack: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.stack : undefined) : undefined
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}