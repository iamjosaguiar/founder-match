import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-development";

export async function getSession() {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";
    
    // Extract the session token from cookies
    const tokenMatch = cookie.match(/better-auth\.session_token=([^;]+)/);
    if (!tokenMatch) {
      return null;
    }
    
    const token = tokenMatch[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // Fetch additional user data since JWT is minimal
    const userDetails = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        image: true,
        profileImage: true,
      }
    });
    
    return {
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        image: userDetails?.image || userDetails?.profileImage || null,
      },
      expires: new Date(payload.exp * 1000).toISOString(),
    };
  } catch (error) {
    return null;
  }
}