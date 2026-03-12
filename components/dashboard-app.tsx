"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock3,
  Database,
  Download,
  Funnel,
  Globe,
  LayoutDashboard,
  Mail,
  Megaphone,
  Phone,
  Plus,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Webhook,
} from "lucide-react";
import type { BootstrapPayload, ContactRecord, ContactStage } from "@/lib/types";
import {
  classNames,
  counties,
  currency,
  inferStatus,
  leadSources,
  pipelineStages,
  products,
  stageLabel,
} from "@/lib/utils";

const premiumTrend = [
  { name: "W1", premium: 8200 },
  { name: "W2", premium: 11600 },
  { name: "W3", premium: 9700 },
  { name: "W4", premium: 14300 },
];

async function requestJson(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || "Request failed");
  }

  return response.json();
}

function SidebarButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
        active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
          <div className="mt-1 text-sm text-slate-500">{detail}</div>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ContactModal({
  open,
  contact,
  onClose,
  onSave,
}: {
  open: boolean;
  contact: ContactRecord | null;
  onClose: () => void;
  onSave: (contact: ContactRecord) => Promise<void>;
}) {
  const [form, setForm] = useState<ContactRecord | null>(contact);

  if (contact && form?.id !== contact.id) {
    setForm(contact);
  }

  if (!open || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-xl font-semibold text-slate-900">Edit Contact</h3>
          <p className="mt-1 text-sm text-slate-500">
            Update record data, premium estimate, stage, and internal notes.
          </p>
        </div>
        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Name</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Email</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Phone</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.phone ?? ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Estimated Premium</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value || 0) })}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>County</span>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.county}
              onChange={(e) => setForm({ ...form, county: e.target.value })}
            >
              {counties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Product</span>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
            >
              {products.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Source</span>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            >
              {leadSources.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Stage</span>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.stage}
              onChange={(e) =>
                setForm({
                  ...form,
                  stage: e.target.value as ContactStage,
                  status: inferStatus(e.target.value),
                })
              }
            >
              {pipelineStages.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Next Step</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.next_step ?? ""}
              onChange={(e) => setForm({ ...form, next_step: e.target.value })}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Owner</span>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.owner_name}
              onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span>Notes</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
            onClick={() => onSave(form)}
          >
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardApp({ initialData }: { initialData: BootstrapPayload }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [countyFilter, setCountyFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ContactRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    county: counties[0],
    product: products[0],
    source: leadSources[0],
    value: 1500,
    notes: "",
    nextStep: "Initial outreach",
  });
  const [taskForm, setTaskForm] = useState({ title: "", due: "", priority: "Medium" });

  const filteredContacts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.contacts.filter((contact) => {
      const matchesQuery =
        !q ||
        contact.name.toLowerCase().includes(q) ||
        (contact.email ?? "").toLowerCase().includes(q) ||
        contact.product.toLowerCase().includes(q) ||
        contact.source.toLowerCase().includes(q);
      const matchesCounty = countyFilter === "all" || contact.county === countyFilter;
      const matchesProduct = productFilter === "all" || contact.product === productFilter;
      return matchesQuery && matchesCounty && matchesProduct;
    });
  }, [countyFilter, data.contacts, productFilter, query]);

  const metrics = useMemo(() => {
    const pipelineValue = filteredContacts.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0
    );
    const hot = filteredContacts.filter((item) => item.status === "Hot").length;
    const won = filteredContacts.filter((item) => item.stage === "closed").length;
    const newLeads = filteredContacts.filter((item) => item.stage === "new").length;
    return { leads: filteredContacts.length, pipelineValue, hot, won, newLeads };
  }, [filteredContacts]);

  const sourceRollup = useMemo(() => {
    const sourceMap = new Map<string, number>();
    filteredContacts.forEach((contact) => {
      sourceMap.set(contact.source, (sourceMap.get(contact.source) ?? 0) + 1);
    });
    return Array.from(sourceMap.entries()).map(([name, leads]) => ({ name, leads }));
  }, [filteredContacts]);

  const stageColumns = useMemo(() => {
    return pipelineStages.map((stage) => ({
      ...stage,
      items: filteredContacts.filter((contact) => contact.stage === stage.key),
    }));
  }, [filteredContacts]);

  async function refresh() {
    const next = await requestJson("/api/bootstrap");
    setData(next);
  }

  async function createLead() {
    setBusy(true);
    setError(null);
    try {
      await requestJson("/api/contacts", { method: "POST", body: JSON.stringify(leadForm) });
      setLeadForm({
        name: "",
        email: "",
        phone: "",
        county: counties[0],
        product: products[0],
        source: leadSources[0],
        value: 1500,
        notes: "",
        nextStep: "Initial outreach",
      });
      setCreateOpen(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create lead");
    } finally {
      setBusy(false);
    }
  }

  async function saveContact(contact: ContactRecord) {
    setBusy(true);
    setError(null);
    try {
      await requestJson(`/api/contacts/${contact.id}`, {
        method: "PATCH",
        body: JSON.stringify(contact),
      });
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save contact");
    } finally {
      setBusy(false);
    }
  }

  async function moveStage(contactId: string, stage: ContactStage) {
    setBusy(true);
    setError(null);
    try {
      await requestJson(`/api/contacts/${contactId}/stage`, {
        method: "POST",
        body: JSON.stringify({ stage }),
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to move stage");
    } finally {
      setBusy(false);
    }
  }

  async function addTask() {
    setBusy(true);
    setError(null);
    try {
      await requestJson("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title: taskForm.title, due: taskForm.due, priority: taskForm.priority }),
      });
      setTaskForm({ title: "", due: "", priority: "Medium" });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add task");
    } finally {
      setBusy(false);
    }
  }

  async function toggleTask(taskId: string) {
    setBusy(true);
    setError(null);
    try {
      await requestJson(`/api/tasks/${taskId}/toggle`, { method: "POST" });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to toggle task");
    } finally {
      setBusy(false);
    }
  }

  async function toggleIntegration(integrationId: string) {
    setBusy(true);
    setError(null);
    try {
      await requestJson(`/api/integrations/${integrationId}/toggle`, { method: "POST" });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to toggle integration");
    } finally {
      setBusy(false);
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "latimore-hub-export.json";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[270px_1fr]">
        <aside className="border-r border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Production Stack
              </div>
              <div className="text-lg font-semibold">Latimore Hub OS</div>
            </div>
          </div>

          <div className="px-3 pt-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{data.user.name}</div>
              <div className="mt-1 text-xs text-slate-500">{data.user.email}</div>
            </div>
          </div>

          <nav className="space-y-1 p-3">
            <SidebarButton
              active={tab === "dashboard"}
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => setTab("dashboard")}
            />
            <SidebarButton
              active={tab === "contacts"}
              icon={Users}
              label="Contacts"
              onClick={() => setTab("contacts")}
            />
            <SidebarButton
              active={tab === "pipeline"}
              icon={Funnel}
              label="Pipeline"
              onClick={() => setTab("pipeline")}
            />
            <SidebarButton
              active={tab === "tasks"}
              icon={CheckSquare}
              label="Tasks"
              onClick={() => setTab("tasks")}
            />
            <SidebarButton
              active={tab === "integrations"}
              icon={Webhook}
              label="Integrations"
              onClick={() => setTab("integrations")}
            />
            <SidebarButton
              active={tab === "data"}
              icon={Database}
              label="Data Model"
              onClick={() => setTab("data")}
            />
            <SidebarButton
              active={tab === "settings"}
              icon={Settings}
              label="Settings"
              onClick={() => setTab("settings")}
            />
          </nav>

          <div className="p-3">
            <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-400">Operations</div>
              <div className="mt-2 text-2xl font-semibold">
                {data.tasks.length
                  ? Math.round(
                      (data.tasks.filter((t) => t.done).length / data.tasks.length) * 100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-slate-300">Task completion rate</div>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Open tasks</span>
                  <span>{data.tasks.filter((t) => !t.done).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inbox events</span>
                  <span>{data.inbox.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Connected tools</span>
                  <span>
                    {
                      data.integrations.filter(
                        (i) => i.status === "Connected" || i.status === "Ready"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Production CRM</h1>
              <p className="text-sm text-slate-500">
                Next.js + Supabase full-stack CRM with lead intake, editable records, API
                routes, auth, and webhooks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-3"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search contacts, products, or sources"
                />
              </div>
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                value={countyFilter}
                onChange={(e) => setCountyFilter(e.target.value)}
              >
                <option value="all">All counties</option>
                {counties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              >
                <option value="all">All products</option>
                {products.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <button
                className="rounded-2xl bg-slate-900 px-4 py-3 text-white"
                onClick={() => setCreateOpen(true)}
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" /> New Lead
                </span>
              </button>
              <button
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700"
                onClick={exportJson}
              >
                <span className="inline-flex items-center gap-2">
                  <Download className="h-4 w-4" /> Export
                </span>
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              title="Active Leads"
              value={metrics.leads}
              detail="Current filtered records"
              icon={Users}
            />
            <MetricCard
              title="Pipeline Value"
              value={currency(metrics.pipelineValue)}
              detail="Estimated annualized premium"
              icon={TrendingUp}
            />
            <MetricCard
              title="Hot Opportunities"
              value={metrics.hot}
              detail="Review and application focus"
              icon={Bell}
            />
            <MetricCard
              title="New Leads"
              value={metrics.newLeads}
              detail="Needs first-touch action"
              icon={Sparkles}
            />
            <MetricCard
              title="Closed Won"
              value={metrics.won}
              detail="Client conversions"
              icon={CheckCircle2}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {(
              [
                ["dashboard", "Dashboard"],
                ["contacts", "Contacts"],
                ["pipeline", "Pipeline"],
                ["tasks", "Tasks"],
                ["integrations", "Integrations"],
                ["data", "Data Model"],
                ["settings", "Settings"],
              ] as [string, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={classNames(
                  "rounded-2xl px-4 py-2.5 text-sm font-medium",
                  tab === value
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "dashboard" && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
                <SectionCard
                  title="Lead Source Performance"
                  description="Acquisition visibility across forms, cards, referrals, and search."
                >
                  <div className="space-y-3">
                    {sourceRollup.length ? (
                      sourceRollup.map((item) => {
                        const max = Math.max(...sourceRollup.map((r) => r.leads));
                        const width = max ? `${(item.leads / max) * 100}%` : "0%";
                        return (
                          <div key={item.name}>
                            <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                              <span>{item.name}</span>
                              <span>{item.leads}</span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-100">
                              <div
                                className="h-3 rounded-full bg-slate-900"
                                style={{ width }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-slate-500">No source data yet.</div>
                    )}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Webhook Inbox"
                  description="Operational event queue for lead ingestion and booking activity."
                >
                  <div className="space-y-3">
                    {data.inbox.slice(0, 5).map((event) => (
                      <div key={event.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-slate-900">{event.source}</div>
                          <span
                            className={classNames(
                              "rounded-full px-2.5 py-1 text-xs font-medium",
                              event.status === "Processed"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700"
                            )}
                          >
                            {event.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                          {JSON.stringify(event.payload_json)}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {new Date(event.received_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                <SectionCard
                  title="Premium Trend"
                  description="Trend block ready for database-backed reporting."
                >
                  <div className="grid grid-cols-4 gap-3">
                    {premiumTrend.map((item) => (
                      <div
                        key={item.name}
                        className="rounded-2xl border border-slate-200 p-4 text-center"
                      >
                        <div className="text-xs uppercase tracking-wide text-slate-400">
                          {item.name}
                        </div>
                        <div className="mt-2 text-lg font-semibold text-slate-900">
                          {currency(item.premium)}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Recent Activity"
                  description="Lifecycle changes, tasks, and system events."
                >
                  <div className="space-y-3">
                    {data.activity.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 p-3"
                      >
                        <div className="rounded-xl bg-slate-100 p-2">
                          <Activity className="h-4 w-4 text-slate-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900">{item.text}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(item.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </div>
          )}

          {tab === "contacts" && (
            <div className="mt-4">
              <SectionCard
                title="Contacts"
                description="Editable CRM records with operational actions and premium visibility."
              >
                <div className="space-y-3">
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <div className="text-base font-semibold text-slate-900">
                            {contact.name}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                              {contact.product}
                            </span>
                            <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                              {contact.source}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                              {contact.status}
                            </span>
                          </div>
                        </div>
                        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
                          <div>
                            <div className="text-xs uppercase tracking-wide text-slate-400">
                              Stage
                            </div>
                            <div className="font-medium text-slate-900">
                              {stageLabel(contact.stage)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wide text-slate-400">
                              County
                            </div>
                            <div className="font-medium text-slate-900">{contact.county}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wide text-slate-400">
                              Owner
                            </div>
                            <div className="font-medium text-slate-900">{contact.owner_name}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wide text-slate-400">
                              Value
                            </div>
                            <div className="font-medium text-slate-900">
                              {currency(contact.value)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                        <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                          <span className="font-medium text-slate-900">Next step:</span>{" "}
                          {contact.next_step || "—"}
                          <div className="mt-2 text-xs text-slate-500">
                            {contact.notes || "No notes entered."}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                            <span className="inline-flex items-center gap-2">
                              <Phone className="h-4 w-4" /> Call
                            </span>
                          </button>
                          <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                            <span className="inline-flex items-center gap-2">
                              <Mail className="h-4 w-4" /> Email
                            </span>
                          </button>
                          <button
                            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                            onClick={() => {
                              const idx = pipelineStages.findIndex(
                                (s) => s.key === contact.stage
                              );
                              const next = pipelineStages[
                                Math.min(idx + 1, pipelineStages.length - 1)
                              ]?.key as ContactStage;
                              moveStage(contact.id, next);
                            }}
                          >
                            <span className="inline-flex items-center gap-2">
                              <ArrowRight className="h-4 w-4" /> Advance
                            </span>
                          </button>
                          <button
                            className="rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white"
                            onClick={() => setEditing(contact)}
                          >
                            Open Record
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {tab === "pipeline" && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex min-w-max gap-4 pb-2">
                {stageColumns.map((stage) => (
                  <div
                    key={stage.key}
                    className="w-[320px] shrink-0 rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{stage.label}</div>
                          <div className="text-sm text-slate-500">
                            {stage.items.length} records
                          </div>
                        </div>
                        <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                          {currency(
                            stage.items.reduce((sum, item) => sum + Number(item.value || 0), 0)
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      {stage.items.length ? (
                        stage.items.map((contact) => (
                          <div
                            key={contact.id}
                            className="rounded-2xl border border-slate-200 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium text-slate-900">{contact.name}</div>
                                <div className="text-sm text-slate-500">{contact.product}</div>
                              </div>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                                {contact.status}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                {contact.county}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                {contact.source}
                              </span>
                            </div>
                            <div className="mt-3 text-sm text-slate-600">
                              {contact.next_step || "No next step."}
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-900">
                                {currency(contact.value)}
                              </span>
                              <span className="text-slate-500">{contact.owner_name}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                          No records in this stage.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "tasks" && (
            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
              <SectionCard
                title="Task Queue"
                description="Operational follow-up with database writes through route handlers."
              >
                <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_150px_140px_auto]">
                  <input
                    className="rounded-2xl border border-slate-200 px-4 py-3"
                    placeholder="New task title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  />
                  <input
                    className="rounded-2xl border border-slate-200 px-4 py-3"
                    placeholder="Due"
                    value={taskForm.due}
                    onChange={(e) => setTaskForm({ ...taskForm, due: e.target.value })}
                  />
                  <select
                    className="rounded-2xl border border-slate-200 px-4 py-3"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-white"
                    onClick={addTask}
                    disabled={busy}
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {data.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={classNames(
                        "flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between",
                        task.done ? "border-green-200 bg-green-50" : "border-slate-200"
                      )}
                    >
                      <div>
                        <div
                          className={classNames(
                            "font-medium",
                            task.done ? "line-through text-slate-400" : "text-slate-900"
                          )}
                        >
                          {task.title}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Clock3 className="h-4 w-4" /> {task.due_label || "Today"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                          {task.priority}
                        </span>
                        <button
                          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                          onClick={() => toggleTask(task.id)}
                        >
                          {task.done ? "Reopen" : "Complete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Schedule + Alerts"
                description="Operational timing blocks and outbound reminders."
              >
                <div className="space-y-3">
                  {(
                    [
                      ["9:30 AM", "Review inbound lead queue"],
                      ["11:00 AM", "FIA consult — Terrence Cole"],
                      ["1:30 PM", "Mortgage protection callback"],
                      ["3:00 PM", "Policy delivery review"],
                    ] as [string, string][]
                  ).map(([time, title]) => (
                    <div key={time} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" /> {time}
                      </div>
                      <div className="mt-2 font-medium text-slate-900">{title}</div>
                    </div>
                  ))}
                  <div className="rounded-2xl bg-slate-950 p-4 text-white">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Bell className="h-4 w-4" /> Reminder
                    </div>
                    <div className="mt-2 text-sm">
                      Same-day follow-up is the highest-leverage operational rule in this
                      workflow.
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {tab === "integrations" && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 lg:grid-cols-3">
                {data.integrations.map((integration) => (
                  <SectionCard
                    key={integration.id}
                    title={integration.provider}
                    description={integration.integration_type}
                  >
                    <div className="text-sm text-slate-600">{integration.detail}</div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                        {integration.status}
                      </span>
                      <button
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        onClick={() => toggleIntegration(integration.id)}
                      >
                        Toggle State
                      </button>
                    </div>
                  </SectionCard>
                ))}
              </div>

              <SectionCard
                title="Backend Flow"
                description="Recommended live transaction path for the real build."
              >
                <div className="grid gap-3 md:grid-cols-5">
                  {(
                    [
                      ["Capture", "Forms, digital card taps, GBP, social ads, referrals"],
                      [
                        "Validate",
                        "Normalize payload, dedupe contact, stamp county and product tags",
                      ],
                      ["Persist", "Write to contacts, tasks, activity, and event tables"],
                      ["Trigger", "Email, SMS, booking flows, and follow-up reminders"],
                      [
                        "Report",
                        "Dashboard KPIs, attribution, pipeline conversion, county performance",
                      ],
                    ] as [string, string][]
                  ).map(([title, text]) => (
                    <div key={title} className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-sm font-semibold text-slate-900">{title}</div>
                      <div className="mt-2 text-sm text-slate-600">{text}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {tab === "data" && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {(
                [
                  [
                    "contacts",
                    "id, owner_user_id, owner_name, name, email, phone, county, product, source, stage, status, value, notes, next_step, created_at, updated_at",
                  ],
                  [
                    "tasks",
                    "id, owner_user_id, contact_id, title, due_label, priority, done, created_at, updated_at",
                  ],
                  [
                    "activity_events",
                    "id, owner_user_id, contact_id, event_type, text, metadata, created_at",
                  ],
                  [
                    "webhook_inbox",
                    "id, owner_user_id, source, status, payload_json, received_at, processed_at",
                  ],
                  [
                    "campaigns",
                    "id, owner_user_id, name, channel, source, spend, leads, appointments, premium",
                  ],
                  [
                    "integrations",
                    "id, owner_user_id, provider, integration_type, status, detail, config_meta, updated_at",
                  ],
                ] as [string, string][]
              ).map(([name, fields]) => (
                <SectionCard key={name} title={name} description="Suggested production table">
                  <div className="text-sm text-slate-600">{fields}</div>
                </SectionCard>
              ))}
            </div>
          )}

          {tab === "settings" && (
            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
              <SectionCard
                title="Environment"
                description="Deployment-facing configuration block."
              >
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                    <span className="inline-flex items-center gap-2">
                      <Server className="h-4 w-4" /> Backend
                    </span>
                    <span className="font-medium text-slate-900">Supabase</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                    <span className="inline-flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Region
                    </span>
                    <span className="font-medium text-slate-900">us-east-1</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                    <span className="inline-flex items-center gap-2">
                      <Megaphone className="h-4 w-4" /> Mode
                    </span>
                    <span className="font-medium text-slate-900">production</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Implementation Layer"
                description="Exact stack powering this CRM."
              >
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="font-medium text-slate-900">Frontend:</span> Next.js App
                    Router + Tailwind
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="font-medium text-slate-900">Auth:</span> Supabase magic
                    link sign-in
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="font-medium text-slate-900">Database:</span> Supabase
                    Postgres with RLS
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="font-medium text-slate-900">Automation:</span> Route
                    handlers + webhooks + scheduled jobs
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="font-medium text-slate-900">Messaging:</span> Resend,
                    Twilio, Calendly webhook sync
                  </div>
                </div>
              </SectionCard>
            </div>
          )}
        </main>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <h3 className="text-xl font-semibold text-slate-900">Create Lead</h3>
              <p className="mt-1 text-sm text-slate-500">
                Writes to contacts, tasks, activity, and webhook inbox through the API.
              </p>
            </div>
            <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Name</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Email</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Phone</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Estimated Premium</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  type="number"
                  value={leadForm.value}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, value: Number(e.target.value || 0) })
                  }
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>County</span>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={leadForm.county}
                  onChange={(e) => setLeadForm({ ...leadForm, county: e.target.value })}
                >
                  {counties.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Product</span>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={leadForm.product}
                  onChange={(e) => setLeadForm({ ...leadForm, product: e.target.value })}
                >
                  {products.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Source</span>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={leadForm.source}
                  onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                >
                  {leadSources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Next Step</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={leadForm.nextStep}
                  onChange={(e) => setLeadForm({ ...leadForm, nextStep: e.target.value })}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Notes</span>
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <button
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                onClick={createLead}
                disabled={busy}
              >
                {busy ? "Saving..." : "Create Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ContactModal
        open={!!editing}
        contact={editing}
        onClose={() => setEditing(null)}
        onSave={saveContact}
      />
    </div>
  );
}
