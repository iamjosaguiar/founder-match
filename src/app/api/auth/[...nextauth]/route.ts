import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-development";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const action = pathSegments[pathSegments.length - 1];

  if (action === 'session') {
    try {
      const authHeader = request.headers.get('authorization');
      const sessionCookie = request.cookies.get('session-token');
      
      if (!authHeader && !sessionCookie) {
        return NextResponse.json(null);
      }

      const token = authHeader?.replace('Bearer ', '') || sessionCookie?.value;
      if (!token) {
        return NextResponse.json(null);
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return NextResponse.json({
        user: decoded.user,
        expires: decoded.exp
      });
    } catch (error) {
      return NextResponse.json(null);
    }
  }

  if (action === 'providers') {
    return NextResponse.json({
      credentials: {
        id: "credentials",
        name: "Credentials",
        type: "credentials"
      }
    });
  }

  return NextResponse.json({ message: "NextAuth API" });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const action = pathSegments[pathSegments.length - 1];

  if (action === 'credentials') {
    try {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
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
          password: true
        }
      });

      if (!user || !user.password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image || user.profileImage
          }
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set cookie and return success
      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || user.profileImage
        },
        token
      });

      response.cookies.set('session-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;

    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
  }

  if (action === 'signout') {
    const response = NextResponse.json({ message: 'Signed out' });
    response.cookies.delete('session-token');
    return response;
  }

  return NextResponse.json({ error: 'Method not supported' }, { status: 405 });
}