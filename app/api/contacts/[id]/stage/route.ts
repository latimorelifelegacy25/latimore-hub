export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { inferStatus, stageLabel } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const stage = body.stage as string;

  const { data: contact, error } = await supabaseAdmin
    .from("contacts")
    .update({ stage, status: inferStatus(stage) })
    .eq("id", id)
    .eq("owner_user_id", user.id)
    .select("id,name,stage")
    .single();

  if (error || !contact) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to move stage" },
      { status: 400 }
    );
  }

  await supabaseAdmin.from("activity_events").insert({
    owner_user_id: user.id,
    contact_id: id,
    event_type: "pipeline",
    text: `${contact.name} moved to ${stageLabel(stage)}`,
    metadata: { stage },
  });

  return NextResponse.json({ ok: true });
}
