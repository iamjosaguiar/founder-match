import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// TEMPORARY DEBUG ENDPOINT - ONLY AVAILABLE IN DEVELOPMENT
export async function GET() {
  // Block access in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Not available in production' }, { status: 404 });
  }
  try {
    const email = 'jos@iamjosaguiar.com';
    const testPassword = 'reset123';
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true
      }
    });
    
    if (!user) {
      return NextResponse.json({
        error: 'User not found',
        email: email
      });
    }
    
    const result = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 'N/A'
      }
    };
    
    if (!user.password) {
      return NextResponse.json({
        ...result,
        error: 'User has no password set'
      });
    }
    
    // Test password comparison
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    // Test manual hash comparison
    const expectedHash = '$2b$12$Gan1THCPwu/OF.98qAP2xuo4eFC4E3QPnlyvKQfZAFwVBSrb1dZB.';
    
    return NextResponse.json({
      ...result,
      passwordTest: {
        password: testPassword,
        isValid: isValid,
        hashComparison: {
          expected: expectedHash,
          actual: user.password?.substring(0, 20) + '...', // Partial for security
          match: user.password === expectedHash
        }
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Also create a password reset endpoint
export async function POST() {
  try {
    const email = 'jos@iamjosaguiar.com';
    const newPassword = 'reset123';
    
    // Generate fresh hash
    const freshHash = await bcrypt.hash(newPassword, 12);
    
    // Verify hash works
    const testVerify = await bcrypt.compare(newPassword, freshHash);
    if (!testVerify) {
      return NextResponse.json({
        error: 'Hash verification failed'
      });
    }
    
    // Update database
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { password: freshHash },
      select: { id: true, email: true, name: true }
    });
    
    // Final verification
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { password: true }
    });
    
    const finalVerify = await bcrypt.compare(newPassword, user?.password || '');
    
    return NextResponse.json({
      success: true,
      user: updatedUser,
      newPassword: newPassword,
      finalVerification: finalVerify,
      message: 'Password reset successful! Please change it after logging in.'
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Password reset failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}