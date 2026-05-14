import { getSession } from "next-auth/react";

export async function getAuthToken() {
  try {
    const session = await getSession();
    const sessionUser = session?.user as any;
    const token = (sessionUser?.accessToken || sessionUser.user?.accessToken) as string | undefined;
    return token || null;
  }
  catch (e) {
    console.warn("Failed to get auth token from session", e);
    return null;
  }
}