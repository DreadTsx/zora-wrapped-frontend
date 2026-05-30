import { Suspense } from "react";
import CollectorsClient from "@/components/collectors/CollectorsClient";
import DashboardLoader from "@/components/dashboard/DashboardLoader";

export default function CollectorsPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <CollectorsClient />
    </Suspense>
  );
}
