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

  const { data: item, error: selectError } = await supabaseAdmin
    .from("integrations")
    .select("id,provider,status")
    .eq("id", id)
    .eq("owner_user_id", user.id)
    .single();

  if (selectError || !item) {
    return NextResponse.json(
      { error: selectError?.message ?? "Integration not found" },
      { status: 404 }
    );
  }

  const nextStatus =
    item.status === "Connected" || item.status === "Ready" ? "Pending" : "Connected";

  const { error } = await supabaseAdmin
    .from("integrations")
    .update({ status: nextStatus })
    .eq("id", id)
    .eq("owner_user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabaseAdmin.from("activity_events").insert({
    owner_user_id: user.id,
    event_type: "integration",
    text: `${item.provider} set to ${nextStatus}`,
    metadata: { provider: item.provider, status: nextStatus },
  });

  return NextResponse.json({ ok: true });
}
