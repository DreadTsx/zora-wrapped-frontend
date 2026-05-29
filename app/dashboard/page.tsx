import { Suspense } from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardLoader from "@/components/dashboard/DashboardLoader";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <DashboardClient />
    </Suspense>
  );
}
