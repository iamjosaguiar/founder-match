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