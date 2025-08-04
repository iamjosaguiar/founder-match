import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const getServerBaseURL = () => {
  // For Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // For custom domain or explicit URL
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  
  // Fallback for development
  return "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: getServerBaseURL(),
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendVerificationEmail({ user, url }: { user: any; url: string }) {
      // Skip email verification for now
      return;
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // extend session by 1 day on activity
  },
  // Map to existing user table structure
  user: {
    modelName: "user", // Use lowercase to match Prisma model
    fields: {
      email: "email",
      name: "name", 
      image: "image",
      emailVerified: "emailVerified",
    },
    additionalFields: {
      profileImage: {
        type: "string",
        required: false,
      },
      roles: {
        type: "string",
        required: false,
        defaultValue: "[\"founder\"]",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;