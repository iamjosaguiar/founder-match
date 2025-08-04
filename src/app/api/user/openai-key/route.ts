import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { encryptApiKey, decryptApiKey, validateOpenAIKey } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 OpenAI Key GET - Starting request');
    
    // Test database connection first
    try {
      await prisma.$connect();
      console.log('✅ Database connected for OpenAI key check');
    } catch (dbError) {
      console.error('💥 Database connection failed in OpenAI key check:', dbError);
      return NextResponse.json({ 
        error: "Database connection failed",
        details: process.env.NODE_ENV === 'development' ? dbError : undefined
      }, { status: 500 });
    }

    // Get session with enhanced error handling
    let session;
    try {
      session = await getSession();
      console.log('🔑 Session check result:', { hasSession: !!session, userId: session?.user?.id });
    } catch (sessionError) {
      console.error('💥 Session retrieval failed:', sessionError);
      return NextResponse.json({ 
        error: "Session validation failed",
        details: process.env.NODE_ENV === 'development' ? sessionError : undefined
      }, { status: 500 });
    }

    if (!session?.user?.id) {
      console.log('❌ No valid session found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query user with enhanced error handling
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { openaiApiKey: true }
      });

      console.log('👤 User lookup result:', { 
        userId: session.user.id, 
        userFound: !!user, 
        hasApiKey: !!user?.openaiApiKey 
      });

      // Return whether the user has a key, but not the key itself
      return NextResponse.json({ 
        hasKey: !!user?.openaiApiKey,
        keyPreview: user?.openaiApiKey ? `sk-***${user.openaiApiKey.slice(-4)}` : null
      });
    } catch (userError) {
      console.error('💥 User query failed:', userError);
      return NextResponse.json({ 
        error: "User lookup failed",
        details: process.env.NODE_ENV === 'development' ? userError : undefined
      }, { status: 500 });
    }

  } catch (error) {
    console.error("💥 Unexpected error in OpenAI key check:", error);
    console.error("💥 Error details:", {
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json({ 
      error: "Failed to check API key",
      details: process.env.NODE_ENV === 'development' ? {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      } : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 });
    }

    if (!validateOpenAIKey(apiKey)) {
      return NextResponse.json({ 
        error: "Invalid OpenAI API key format. Key should start with 'sk-'" 
      }, { status: 400 });
    }

    // Encrypt the API key before storing
    const encryptedKey = encryptApiKey(apiKey);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { openaiApiKey: encryptedKey }
    });

    return NextResponse.json({ 
      success: true, 
      message: "OpenAI API key saved successfully",
      keyPreview: `sk-***${apiKey.slice(-4)}`
    });
  } catch (error) {
    console.error("Error saving OpenAI key:", error);
    return NextResponse.json({ error: "Failed to save API key" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { openaiApiKey: null }
    });

    return NextResponse.json({ 
      success: true, 
      message: "OpenAI API key removed successfully" 
    });
  } catch (error) {
    console.error("Error removing OpenAI key:", error);
    return NextResponse.json({ error: "Failed to remove API key" }, { status: 500 });
  }
}