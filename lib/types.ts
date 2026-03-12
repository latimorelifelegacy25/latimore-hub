export type ContactStage = "new" | "contacted" | "review" | "quoted" | "application" | "closed";
export type ContactStatus = "New" | "Warm" | "Hot" | "Client";
export type Priority = "High" | "Medium" | "Low";

export interface ContactRecord {
  id: string;
  owner_user_id: string;
  owner_name: string;
  name: string;
  email: string | null;
  phone: string | null;
  county: string;
  product: string;
  source: string;
  stage: ContactStage;
  status: ContactStatus;
  value: number;
  notes: string | null;
  next_step: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskRecord {
  id: string;
  owner_user_id: string;
  contact_id: string | null;
  title: string;
  due_label: string | null;
  priority: Priority;
  done: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityRecord {
  id: string;
  owner_user_id: string;
  contact_id: string | null;
  event_type: string;
  text: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface InboxRecord {
  id: string;
  owner_user_id: string | null;
  source: string;
  status: string;
  payload_json: Record<string, unknown>;
  received_at: string;
  processed_at: string | null;
}

export interface IntegrationRecord {
  id: string;
  owner_user_id: string;
  provider: string;
  integration_type: string;
  status: string;
  detail: string | null;
  config_meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CampaignRecord {
  id: string;
  owner_user_id: string;
  name: string;
  channel: string;
  source: string;
  spend: number;
  leads: number;
  appointments: number;
  premium: number;
  created_at: string;
  updated_at: string;
}

export interface BootstrapPayload {
  user: {
    id: string;
    email: string | null;
    name: string;
  };
  contacts: ContactRecord[];
  tasks: TaskRecord[];
  activity: ActivityRecord[];
  inbox: InboxRecord[];
  integrations: IntegrationRecord[];
  campaigns: CampaignRecord[];
  sourceRollup: Array<{ name: string; leads: number }>;
}
