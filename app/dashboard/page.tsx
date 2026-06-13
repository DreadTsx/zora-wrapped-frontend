import { Suspense } from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardLoader from "@/components/dashboard/DashboardLoader";
import { DashboardErrorBoundary } from "@/components/AppErrorBoundary";

export default function DashboardPage() {
  return (
    <DashboardErrorBoundary>
      <Suspense fallback={<DashboardLoader />}>
        <DashboardClient />
      </Suspense>
    </DashboardErrorBoundary>
  );
}
