import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new Response("Not authenticated", { status: 401 });
  }

  return Response.json(session);
}
