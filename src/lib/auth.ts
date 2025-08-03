import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            if (process.env.NODE_ENV === 'development') {
              console.log("Missing credentials");
            }
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            },
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
            if (process.env.NODE_ENV === 'development') {
              console.log("User not found or no password");
            }
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            if (process.env.NODE_ENV === 'development') {
              console.log("Invalid password");
            }
            return null;
          }

          if (process.env.NODE_ENV === 'development') {
            console.log("User authenticated successfully:", user.email);
          }
          
          // Return user data including image fields
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image || user.profileImage,
            profileImage: user.profileImage
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn(message) {
      console.log("NextAuth signIn event:", message);
    },
    async signOut(message) {
      console.log("NextAuth signOut event:", message);
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store user data including image info in JWT
        token.id = user.id;
        token.image = user.image;
        token.profileImage = user.profileImage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.profileImage = token.profileImage as string;
      }
      return session;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);