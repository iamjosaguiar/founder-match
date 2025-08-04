import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // No baseURL needed - better-auth will use the current origin by default
});

export const {
  signIn,
  signUp, 
  signOut,
  useSession,
  getSession,
} = authClient;

// Social sign-in functions using better-auth
export const socialSignIn = {
  github: () => signIn.social({ provider: "github" }),
  google: () => signIn.social({ provider: "google" }),  
  discord: () => signIn.social({ provider: "discord" }),
};