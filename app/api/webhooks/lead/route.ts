export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { inferStatus } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const ownerUserId = payload.owner_user_id as string | undefined;

  if (!ownerUserId) {
    return NextResponse.json({ error: "owner_user_id required" }, { status: 400 });
  }

  const name = payload.name || payload.full_name || "Unknown Lead";
  const email = payload.email || null;
  const phone = payload.phone || null;
  const county = payload.county || "Schuylkill";
  const product = payload.product || "IUL";
  const source = payload.source || "Webhook Lead";

  const { data: contact } = await supabaseAdmin
    .from("contacts")
    .insert({
      owner_user_id: ownerUserId,
      owner_name: payload.owner_name || "Advisor",
      name,
      email,
      phone,
      county,
      product,
      source,
      stage: "new",
      status: inferStatus("new"),
      value: Number(payload.value || 0),
      notes: payload.notes || null,
      next_step: payload.next_step || "Initial outreach",
    })
    .select("*")
    .single();

  await Promise.all([
    supabaseAdmin.from("webhook_inbox").insert({
      owner_user_id: ownerUserId,
      source,
      status: "Processed",
      payload_json: payload,
      processed_at: new Date().toISOString(),
    }),
    contact
      ? supabaseAdmin.from("tasks").insert({
          owner_user_id: ownerUserId,
          contact_id: contact.id,
          title: `Follow up with ${contact.name}`,
          due_label: "Today",
          priority: "High",
          done: false,
        })
      : Promise.resolve(),
    contact
      ? supabaseAdmin.from("activity_events").insert({
          owner_user_id: ownerUserId,
          contact_id: contact.id,
          event_type: "lead_webhook",
          text: `Webhook lead ingested: ${contact.name} via ${source}`,
          metadata: payload,
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true, contactId: contact?.id ?? null });
}
