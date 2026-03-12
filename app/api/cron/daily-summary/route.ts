import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [{ data: contacts }, { data: tasks }, { data: activity }] = await Promise.all([
    supabaseAdmin.from("contacts").select("id").gte("created_at", since),
    supabaseAdmin.from("tasks").select("id,done").gte("created_at", since),
    supabaseAdmin.from("activity_events").select("id").gte("created_at", since),
  ]);

  return NextResponse.json({
    ok: true,
    window: "24h",
    contacts_created: contacts?.length ?? 0,
    tasks_created: tasks?.length ?? 0,
    tasks_completed: tasks?.filter((item) => item.done).length ?? 0,
    events_logged: activity?.length ?? 0,
    generated_at: new Date().toISOString(),
  });
}
