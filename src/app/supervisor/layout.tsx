import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const dynamic = "force-dynamic";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
