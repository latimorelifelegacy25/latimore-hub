export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { inferStatus } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const ownerName = user.email?.split("@")[0]?.replace(/[._-]/g, " ") || "Advisor";

  const contactInsert = {
    owner_user_id: user.id,
    owner_name: ownerName,
    name: body.name,
    email: body.email || null,
    phone: body.phone || null,
    county: body.county,
    product: body.product,
    source: body.source,
    stage: "new",
    status: inferStatus("new"),
    value: Number(body.value || 0),
    notes: body.notes || null,
    next_step: body.nextStep || "Initial outreach",
  };

  const { data: contact, error } = await supabaseAdmin
    .from("contacts")
    .insert(contactInsert)
    .select("*")
    .single();

  if (error || !contact) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to create contact" },
      { status: 400 }
    );
  }

  await Promise.all([
    supabaseAdmin.from("tasks").insert({
      owner_user_id: user.id,
      contact_id: contact.id,
      title: `Follow up with ${contact.name}`,
      due_label: "Today",
      priority: "High",
      done: false,
    }),
    supabaseAdmin.from("activity_events").insert({
      owner_user_id: user.id,
      contact_id: contact.id,
      event_type: "lead",
      text: `New lead captured: ${contact.name} via ${contact.source}`,
      metadata: { source: contact.source, product: contact.product },
    }),
    supabaseAdmin.from("webhook_inbox").insert({
      owner_user_id: user.id,
      source: contact.source,
      status: "Processed",
      payload_json: {
        event: "manual_contact_create",
        name: contact.name,
        email: contact.email,
        product: contact.product,
      },
      processed_at: new Date().toISOString(),
    }),
  ]);

  return NextResponse.json({ ok: true, contact });
}
