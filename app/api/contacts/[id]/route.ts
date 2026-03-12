export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { inferStatus } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const payload = {
    name: body.name,
    email: body.email || null,
    phone: body.phone || null,
    county: body.county,
    product: body.product,
    source: body.source,
    stage: body.stage,
    status: inferStatus(body.stage),
    value: Number(body.value || 0),
    notes: body.notes || null,
    next_step: body.next_step || body.nextStep || null,
    owner_name: body.owner_name || body.ownerName || "Advisor",
  };

  const { error } = await supabaseAdmin
    .from("contacts")
    .update(payload)
    .eq("id", id)
    .eq("owner_user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabaseAdmin.from("activity_events").insert({
    owner_user_id: user.id,
    contact_id: id,
    event_type: "update",
    text: `Record updated for ${body.name}`,
    metadata: { stage: body.stage },
  });

  return NextResponse.json({ ok: true });
}
