export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getDashboardOverview } from "@/lib/hub/reporting";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const overview = await getDashboardOverview();

  return NextResponse.json({
    ok: true,
    window: "24h",
    leads_this_month: overview.kpis.leadsThisMonth,
    bookings_this_month: overview.kpis.bookingsThisMonth,
    stale_leads: overview.kpis.staleLeads,
    pipeline_summary: overview.pipeline,
    generated_at: new Date().toISOString(),
  });
}
