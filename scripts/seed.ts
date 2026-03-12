import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

async function main() {
  const email = process.env.SEED_OWNER_EMAIL;
  if (!email) {
    throw new Error("SEED_OWNER_EMAIL is required");
  }

  const admin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: users, error: listError } = await admin.auth.admin.listUsers();
  if (listError) throw listError;

  const user = users.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error(`Could not find auth user for ${email}`);
  }

  const owner_user_id = user.id;
  const owner_name = "Jackson Latimore";

  await admin.from("contacts").delete().eq("owner_user_id", owner_user_id);
  await admin.from("tasks").delete().eq("owner_user_id", owner_user_id);
  await admin.from("activity_events").delete().eq("owner_user_id", owner_user_id);
  await admin.from("webhook_inbox").delete().eq("owner_user_id", owner_user_id);
  await admin.from("integrations").delete().eq("owner_user_id", owner_user_id);
  await admin.from("campaigns").delete().eq("owner_user_id", owner_user_id);

  const { data: contacts } = await admin
    .from("contacts")
    .insert([
      {
        owner_user_id,
        owner_name,
        name: "Maria Hill",
        email: "maria.hill@example.com",
        phone: "(570) 555-0181",
        county: "Schuylkill",
        product: "IUL",
        source: "Website Form",
        stage: "quoted",
        status: "Warm",
        value: 2400,
        notes: "Wants indexed accumulation and family protection review.",
        next_step: "Policy illustration follow-up",
      },
      {
        owner_user_id,
        owner_name,
        name: "Terrence Cole",
        email: "terrence.cole@example.com",
        phone: "(570) 555-0125",
        county: "Luzerne",
        product: "FIA",
        source: "Google Business",
        stage: "review",
        status: "Hot",
        value: 5200,
        notes: "Retirement funds parked in cash, wants principal protection.",
        next_step: "Set retirement review",
      },
      {
        owner_user_id,
        owner_name,
        name: "Angela Brooks",
        email: "angela.brooks@example.com",
        phone: "(570) 555-0104",
        county: "Luzerne",
        product: "Mortgage Protection",
        source: "Facebook Lead Form",
        stage: "application",
        status: "Hot",
        value: 3100,
        notes: "Carrier paperwork pending.",
        next_step: "Carrier docs pending",
      },
    ])
    .select("*");

  const terrence = contacts?.find((item) => item.name === "Terrence Cole");
  const maria = contacts?.find((item) => item.name === "Maria Hill");

  await admin.from("tasks").insert([
    {
      owner_user_id,
      contact_id: terrence?.id ?? null,
      title: "Call Terrence about FIA review",
      due_label: "10:00 AM",
      priority: "High",
      done: false,
    },
    {
      owner_user_id,
      contact_id: maria?.id ?? null,
      title: "Send Maria illustration PDF",
      due_label: "11:30 AM",
      priority: "High",
      done: false,
    },
  ]);

  await admin.from("activity_events").insert([
    {
      owner_user_id,
      contact_id: maria?.id ?? null,
      event_type: "email",
      text: "Quote sent to Maria Hill",
      metadata: {},
    },
    {
      owner_user_id,
      contact_id: terrence?.id ?? null,
      event_type: "meeting",
      text: "Retirement review booked with Terrence Cole",
      metadata: {},
    },
  ]);

  await admin.from("webhook_inbox").insert([
    {
      owner_user_id,
      source: "Calendly",
      status: "Processed",
      payload_json: { message: "Retirement review booked for Terrence Cole" },
      processed_at: new Date().toISOString(),
    },
    {
      owner_user_id,
      source: "Website Form",
      status: "Processed",
      payload_json: { message: "Lead captured from mortgage protection landing page" },
      processed_at: new Date().toISOString(),
    },
  ]);

  await admin.from("integrations").insert([
    {
      owner_user_id,
      provider: "Supabase",
      integration_type: "Database",
      status: "Connected",
      detail: "Contacts, tasks, activity, webhooks",
      config_meta: {},
    },
    {
      owner_user_id,
      provider: "Resend",
      integration_type: "Email",
      status: "Ready",
      detail: "Transactional follow-up and quote delivery",
      config_meta: {},
    },
    {
      owner_user_id,
      provider: "Twilio",
      integration_type: "SMS",
      status: "Ready",
      detail: "Text reminders and missed-call recovery",
      config_meta: {},
    },
    {
      owner_user_id,
      provider: "Calendly",
      integration_type: "Scheduling",
      status: "Connected",
      detail: "Booking ingestion and event attribution",
      config_meta: {},
    },
  ]);

  await admin.from("campaigns").insert([
    {
      owner_user_id,
      name: "Mortgage Protection Push",
      channel: "Landing Page + Forms",
      source: "Website Form",
      spend: 0,
      leads: 18,
      appointments: 4,
      premium: 6400,
    },
    {
      owner_user_id,
      name: "FIA Retirement Review",
      channel: "GBP + Follow-up Email",
      source: "Google Business",
      spend: 0,
      leads: 11,
      appointments: 3,
      premium: 9800,
    },
  ]);

  console.log("Seed completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
