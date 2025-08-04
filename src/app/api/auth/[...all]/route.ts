import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-development";

// Helper to create JWT token - minimal payload to keep under 4KB cookie limit
function createToken(user: any) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: (user.name || '').substring(0, 50), // Limit name length
      // Skip image to reduce token size
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    },
    JWT_SECRET
  );
}

// Helper to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  console.log('GET request to:', pathname);
  
  // Let better-auth handle social provider GET requests (OAuth callbacks, etc.)
  if (pathname.includes('/github') || pathname.includes('/google') || pathname.includes('/discord') || 
      pathname.includes('/callback') || pathname.includes('/signin') || pathname.includes('/signup')) {
    return auth.handler(request);
  }
  
  // Handle session endpoint
  if (pathname.includes('/session')) {
    try {
      const token = request.cookies.get('better-auth.session_token')?.value ||
                   request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return NextResponse.json(null);
      }
      
      const payload = verifyToken(token);
      if (!payload || typeof payload !== 'object') {
        return NextResponse.json(null);
      }
      
      // Fetch additional user data since we keep JWT minimal
      const userDetails = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          image: true,
          profileImage: true,
        }
      });
      
      return NextResponse.json({
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          image: userDetails?.image || userDetails?.profileImage || null,
        },
        expires: new Date((payload.exp || 0) * 1000).toISOString(),
      });
    } catch (error) {
      console.error('Session error:', error);
      return NextResponse.json(null);
    }
  }
  
  // Handle other GET endpoints
  return NextResponse.json({ message: "Auth API GET" });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  console.log('POST request to:', pathname);
  
  // Let better-auth handle social provider POST requests
  if (pathname.includes('/github') || pathname.includes('/google') || pathname.includes('/discord') || 
      pathname.includes('/callback')) {
    return auth.handler(request);
  }
  
  // Handle sign-out before JSON parsing (no body needed)
  if (pathname.includes('/sign-out')) {
    try {
      const response = NextResponse.json({ success: true });
      response.cookies.set('better-auth.session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Expire immediately
        path: '/',
      });
      return response;
    } catch (error) {
      console.error('Sign-out error:', error);
      return NextResponse.json(
        { error: 'Sign-out failed' },
        { status: 500 }
      );
    }
  }
  
  try {
    const body = await request.json();
    
    // Handle sign-in with email/password
    if (pathname.includes('/sign-in/email')) {
      console.log('Processing sign-in request for:', body.email);
      const { email, password } = body;
      
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }
      
      // Find user in database
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          profileImage: true,
          password: true,
        }
      });
      
      if (!user || !user.password) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 400 }
        );
      }
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 400 }
        );
      }
      
      // Create JWT token
      const token = createToken(user);
      
      // Create response that matches better-auth expected format
      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || user.profileImage,
        },
        session: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)).toISOString(),
        }
      });
      
      // Set cookie
      response.cookies.set('better-auth.session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      
      return response;
    }
    
    // Handle sign-up with email/password  
    if (pathname.includes('/sign-up/email')) {
      const { email, password, name } = body;
      
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          password: hashedPassword,
          emailVerified: new Date(), // Auto-verify for now
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          profileImage: true,
        }
      });
      
      // Create JWT token
      const token = createToken(user);
      
      // Create response
      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || user.profileImage,
        },
        token,
      });
      
      // Set cookie
      response.cookies.set('better-auth.session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      
      return response;
    }
    
    
    return NextResponse.json(
      { error: 'Endpoint not found' },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}