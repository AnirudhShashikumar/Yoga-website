import { EmptyState } from "@/components/ui/empty-state";

export function AdminDataError() {
  return <EmptyState title="Administration data is unavailable." description="No private business data has been displayed. Refresh the page or try again in a moment." />;
}
