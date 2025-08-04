#!/usr/bin/env node

/**
 * Production Database Migration Script
 * This script adds the missing openaiApiKey column to the production database
 */

const { PrismaClient } = require('@prisma/client');

async function migrateProduction() {
  console.log('🔄 Starting production database migration...');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('Please set your Neon database URL in the DATABASE_URL environment variable');
    process.exit(1);
  }

  console.log('📊 Database URL:', process.env.DATABASE_URL.substring(0, 30) + '...');

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check if column already exists
    console.log('🔍 Checking if openaiApiKey column exists...');
    try {
      await prisma.user.findFirst({
        select: { openaiApiKey: true }
      });
      console.log('✅ openaiApiKey column already exists');
      return;
    } catch (error) {
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

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateProduction().catch(console.error);