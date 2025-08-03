import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-development";

export async function auth() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token');
    
    if (!sessionToken?.value) {
      return null;
    }

    const decoded = jwt.verify(sessionToken.value, JWT_SECRET) as any;
    
    return {
      user: decoded.user,
      expires: new Date(decoded.exp * 1000).toISOString()
    };
  } catch (error) {
    return null;
  }
}

// Placeholder functions for compatibility
export async function signIn() {
  // This should redirect to sign-in page
  return;
}

export async function signOut() {
  // This should clear session
  return;
}