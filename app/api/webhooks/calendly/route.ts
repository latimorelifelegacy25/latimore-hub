export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const ownerUserId = payload.owner_user_id as string | undefined;
  const inviteeEmail = payload.invitee_email as string | undefined;

  if (!ownerUserId) {
    return NextResponse.json({ error: "owner_user_id required" }, { status: 400 });
  }

  await supabaseAdmin.from("webhook_inbox").insert({
    owner_user_id: ownerUserId,
    source: "Calendly",
    status: "Processed",
    payload_json: payload,
    processed_at: new Date().toISOString(),
  });

  if (inviteeEmail) {
    const { data: contact } = await supabaseAdmin
      .from("contacts")
      .select("id,name")
      .eq("owner_user_id", ownerUserId)
      .eq("email", inviteeEmail)
      .maybeSingle();

    if (contact) {
      await supabaseAdmin.from("activity_events").insert({
        owner_user_id: ownerUserId,
        contact_id: contact.id,
        event_type: "meeting",
        text: `Calendly booking received for ${contact.name}`,
        metadata: payload,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
