import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getBootstrapPayload } from "@/lib/bootstrap";
import DashboardApp from "@/components/dashboard-app";

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  const payload = await getBootstrapPayload(user.id, user.email ?? null);
  return <DashboardApp initialData={payload} />;
}
