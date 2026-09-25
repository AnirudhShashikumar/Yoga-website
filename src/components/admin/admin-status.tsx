import { StatusBadge } from "@/components/ui/status-badge";

export function AdminStatus({ status }: { status: string }) {
  const tone = status === "published" || status === "confirmed" || status === "converted"
    ? "success"
    : status === "pending" || status === "new" || status === "contacted" || status === "draft"
      ? "warning"
      : status === "cancelled" || status === "closed"
        ? "danger"
        : "neutral";
  return <StatusBadge tone={tone}>{status}</StatusBadge>;
}
