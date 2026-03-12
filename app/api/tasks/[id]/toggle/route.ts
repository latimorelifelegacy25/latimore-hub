export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data: task, error: selectError } = await supabaseAdmin
    .from("tasks")
    .select("id,title,done,contact_id")
    .eq("id", id)
    .eq("owner_user_id", user.id)
    .single();

  if (selectError || !task) {
    return NextResponse.json(
      { error: selectError?.message ?? "Task not found" },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from("tasks")
    .update({ done: !task.done })
    .eq("id", id)
    .eq("owner_user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabaseAdmin.from("activity_events").insert({
    owner_user_id: user.id,
    contact_id: task.contact_id,
    event_type: "task",
    text: `${task.done ? "Reopened" : "Completed"} task: ${task.title}`,
    metadata: { taskId: task.id },
  });

  return NextResponse.json({ ok: true });
}
