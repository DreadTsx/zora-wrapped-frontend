import { Suspense } from "react";
import CollectionsClient from "@/components/collections/CollectionsClient";
import DashboardLoader from "@/components/dashboard/DashboardLoader";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <CollectionsClient />
    </Suspense>
  );
}
