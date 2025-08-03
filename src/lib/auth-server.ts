import { auth } from "./auth";
import { headers } from "next/headers";

export async function getSession() {
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";
  
  try {
    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: cookie,
      }),
    });
    
    return session;
  } catch (error) {
    return null;
  }
}