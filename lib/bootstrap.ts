import { supabaseAdmin } from "@/lib/supabase/admin";
import type { BootstrapPayload } from "@/lib/types";

export async function getBootstrapPayload(
  userId: string,
  email: string | null
): Promise<BootstrapPayload> {
  const [contactsRes, tasksRes, activityRes, inboxRes, integrationsRes, campaignsRes] =
    await Promise.all([
      supabaseAdmin
        .from("contacts")
        .select("*")
        .eq("owner_user_id", userId)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("tasks")
        .select("*")
        .eq("owner_user_id", userId)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("activity_events")
        .select("*")
        .eq("owner_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(25),
      supabaseAdmin
        .from("webhook_inbox")
        .select("*")
        .or(`owner_user_id.eq.${userId},owner_user_id.is.null`)
        .order("received_at", { ascending: false })
        .limit(25),
      supabaseAdmin
        .from("integrations")
        .select("*")
        .eq("owner_user_id", userId)
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("campaigns")
        .select("*")
        .eq("owner_user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

  const contacts = contactsRes.data ?? [];
  const sourceMap = new Map<string, number>();
  contacts.forEach((contact) => {
    sourceMap.set(contact.source, (sourceMap.get(contact.source) ?? 0) + 1);
  });

  return {
    user: {
      id: userId,
      email,
      name: email?.split("@")[0]?.replace(/[._-]/g, " ") || "Advisor",
    },
    contacts,
    tasks: tasksRes.data ?? [],
    activity: activityRes.data ?? [],
    inbox: inboxRes.data ?? [],
    integrations: integrationsRes.data ?? [],
    campaigns: campaignsRes.data ?? [],
    sourceRollup: Array.from(sourceMap.entries()).map(([name, leads]) => ({ name, leads })),
  };
}
