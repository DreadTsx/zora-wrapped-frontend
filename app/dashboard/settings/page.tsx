import { Suspense } from "react";
import SettingsClient from "@/components/settings/SettingsClient";
import DashboardLoader from "@/components/dashboard/DashboardLoader";

export default function SettingsPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <SettingsClient />
    </Suspense>
  );
}
