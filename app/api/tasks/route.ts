export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { data: task, error } = await supabaseAdmin
    .from("tasks")
    .insert({
      owner_user_id: user.id,
      title: body.title,
      due_label: body.due_label || body.due || "Today",
      priority: body.priority || "Medium",
      done: false,
      contact_id: body.contact_id || null,
    })
    .select("*")
    .single();

  if (error || !task) {
    return NextResponse.json({ error: error?.message ?? "Unable to create task" }, { status: 400 });
  }

  await supabaseAdmin.from("activity_events").insert({
    owner_user_id: user.id,
    contact_id: task.contact_id,
    event_type: "task",
    text: `Task created: ${task.title}`,
    metadata: { priority: task.priority },
  });

  return NextResponse.json({ ok: true, task });
}
