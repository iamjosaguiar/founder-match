import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { encryptApiKey, decryptApiKey, validateOpenAIKey } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { openaiApiKey: true }
    });

    // Return whether the user has a key, but not the key itself
    return NextResponse.json({ 
      hasKey: !!user?.openaiApiKey,
      keyPreview: user?.openaiApiKey ? `sk-***${user.openaiApiKey.slice(-4)}` : null
    });
  } catch (error) {
    console.error("Error checking OpenAI key:", error);
    return NextResponse.json({ error: "Failed to check API key" }, { status: 500 });
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