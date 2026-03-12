import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getBootstrapPayload } from "@/lib/bootstrap";

export const runtime = "nodejs";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getBootstrapPayload(user.id, user.email ?? null);
  return NextResponse.json(payload);
}
