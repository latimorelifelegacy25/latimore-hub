create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  owner_name text not null,
  name text not null,
  email text,
  phone text,
  county text not null,
  product text not null,
  source text not null,
  stage text not null default 'new',
  status text not null default 'New',
  value numeric(12,2) not null default 0,
  notes text,
  next_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  title text not null,
  due_label text,
  priority text not null default 'Medium',
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  event_type text not null,
  text text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.webhook_inbox (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete cascade,
  source text not null,
  status text not null default 'Pending',
  payload_json jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  integration_type text not null,
  status text not null default 'Pending',
  detail text,
  config_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  channel text not null,
  source text not null,
  spend numeric(12,2) not null default 0,
  leads integer not null default 0,
  appointments integer not null default 0,
  premium numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute procedure public.set_updated_at();

create or replace trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();

create or replace trigger integrations_set_updated_at
  before update on public.integrations
  for each row execute procedure public.set_updated_at();

alter table public.contacts enable row level security;
alter table public.tasks enable row level security;
alter table public.activity_events enable row level security;
alter table public.webhook_inbox enable row level security;
alter table public.integrations enable row level security;
alter table public.campaigns enable row level security;

create policy "contacts_owner_select" on public.contacts for select using (auth.uid() = owner_user_id);
create policy "contacts_owner_insert" on public.contacts for insert with check (auth.uid() = owner_user_id);
create policy "contacts_owner_update" on public.contacts for update using (auth.uid() = owner_user_id);
create policy "contacts_owner_delete" on public.contacts for delete using (auth.uid() = owner_user_id);

create policy "tasks_owner_select" on public.tasks for select using (auth.uid() = owner_user_id);
create policy "tasks_owner_insert" on public.tasks for insert with check (auth.uid() = owner_user_id);
create policy "tasks_owner_update" on public.tasks for update using (auth.uid() = owner_user_id);
create policy "tasks_owner_delete" on public.tasks for delete using (auth.uid() = owner_user_id);

create policy "activity_owner_select" on public.activity_events for select using (auth.uid() = owner_user_id);
create policy "activity_owner_insert" on public.activity_events for insert with check (auth.uid() = owner_user_id);

create policy "inbox_owner_select" on public.webhook_inbox for select using (auth.uid() = owner_user_id);
create policy "inbox_owner_insert" on public.webhook_inbox for insert with check (owner_user_id is null or auth.uid() = owner_user_id);
create policy "inbox_owner_update" on public.webhook_inbox for update using (owner_user_id is null or auth.uid() = owner_user_id);

create policy "integrations_owner_select" on public.integrations for select using (auth.uid() = owner_user_id);
create policy "integrations_owner_insert" on public.integrations for insert with check (auth.uid() = owner_user_id);
create policy "integrations_owner_update" on public.integrations for update using (auth.uid() = owner_user_id);

create policy "campaigns_owner_select" on public.campaigns for select using (auth.uid() = owner_user_id);
create policy "campaigns_owner_insert" on public.campaigns for insert with check (auth.uid() = owner_user_id);
create policy "campaigns_owner_update" on public.campaigns for update using (auth.uid() = owner_user_id);
