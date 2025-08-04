import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Initializing database...');
    
    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connected');

    // Generate Prisma schema (equivalent to prisma db push)
    console.log('🔄 Ensuring database schema is up to date...');
    
    // Check if User table exists by attempting to count users
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Database schema OK - found ${userCount} users`);
    } catch (schemaError) {
      console.error('❌ Database schema issue:', schemaError);
      return NextResponse.json(
        { 
          error: 'Database schema not initialized. Please run `prisma db push` or `prisma migrate deploy`',
          details: schemaError instanceof Error ? schemaError.message : 'Unknown schema error'
        },
        { status: 500 }
      );
    }

    // Create a test user if none exist (only in development)
    const userCount = await prisma.user.count();
    if (userCount === 0 && process.env.NODE_ENV === 'development') {
      console.log('🔄 Creating test user...');
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@cofoundr.online',
          name: 'Test User',
          password: hashedPassword,
          emailVerified: new Date(),
        }
      });
      
      console.log('✅ Test user created:', testUser.email);
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      userCount: await prisma.user.count(),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    
    return NextResponse.json(
      {
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.stack : undefined) : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}