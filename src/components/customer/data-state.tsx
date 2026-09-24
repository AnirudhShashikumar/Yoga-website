import { EmptyState } from "@/components/ui/empty-state";

export function CustomerDataError() {
  return (
    <EmptyState
      title="We could not load this information."
      description="Your private account data has not been displayed. Refresh the page or try again in a moment."
    />
  );
}
