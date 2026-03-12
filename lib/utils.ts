export const pipelineStages = [
  { key: "new", label: "New Lead" },
  { key: "contacted", label: "Contacted" },
  { key: "review", label: "Needs Review" },
  { key: "quoted", label: "Quoted" },
  { key: "application", label: "Application" },
  { key: "closed", label: "Closed Won" },
] as const;

export const counties = ["Schuylkill", "Luzerne", "Northumberland"];
export const products = [
  "IUL",
  "FIA",
  "Whole Life",
  "Term + Living Benefits",
  "Mortgage Protection",
  "Final Expense",
];
export const leadSources = [
  "Website Form",
  "Google Business",
  "Digital Card",
  "Referral",
  "Facebook Lead Form",
  "Workshop",
  "Community Event",
  "Organic Search",
];

export function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function inferStatus(stage: string): "New" | "Warm" | "Hot" | "Client" {
  if (stage === "closed") return "Client";
  if (stage === "application" || stage === "review") return "Hot";
  if (stage === "quoted" || stage === "contacted") return "Warm";
  return "New";
}

export function stageLabel(stage: string): string {
  return pipelineStages.find((item) => item.key === stage)?.label ?? stage;
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
