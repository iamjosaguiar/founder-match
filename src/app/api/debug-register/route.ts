import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// TEMPORARY DEBUG REGISTRATION ENDPOINT - ONLY AVAILABLE IN DEVELOPMENT
export async function POST(req: Request) {
  // Block access in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Not available in production' }, { status: 404 });
  }
  try {
    console.log("=== DEBUG REGISTRATION START ===");
    
    // Test basic functionality first
    console.log("1. Testing JSON parsing...");
    const body = await req.json();
    console.log("Body received:", { ...body, password: "[HIDDEN]" });
    
    const { name, email, password } = body;
    
    console.log("2. Testing input validation...");
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log("❌ Password too short");
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    
    console.log("3. Testing database connection...");
    // Simple database test first
    const userCount = await prisma.user.count();
    console.log("✅ Database connected, user count:", userCount);

    console.log("4. Testing user lookup...");
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    console.log("Existing user check:", !!existingUser);

    if (existingUser) {
      console.log("❌ User already exists");
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    console.log("5. Testing password hashing...");
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("✅ Password hashed successfully");

    console.log("6. Testing user creation...");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        assessmentCompleted: false,
        quizCompleted: false,
      },
    });
    console.log("✅ User created successfully:", user.id);

    console.log("=== DEBUG REGISTRATION SUCCESS ===");
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("=== DEBUG REGISTRATION ERROR ===");
    console.error("Error type:", typeof error);
    console.error("Error name:", error?.constructor?.name);
    console.error("Error message:", (error as Error)?.message);
    console.error("Error stack:", (error as Error)?.stack);
    
    // Prisma-specific error details
    if ((error as any)?.code) {
      console.error("Prisma error code:", (error as any).code);
    }
    if ((error as any)?.meta) {
      console.error("Prisma error meta:", (error as any).meta);
    }
    
    return NextResponse.json(
      { 
        message: "Internal server error",
        debug: {
          type: typeof error,
          name: error?.constructor?.name,
          message: (error as Error)?.message,
          code: (error as any)?.code,
          meta: (error as any)?.meta
        }
      },
      { status: 500 }
    );
  }
}