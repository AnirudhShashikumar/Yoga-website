import type { Metadata, Route } from "next";
import Link from "next/link";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatus } from "@/components/admin/admin-status";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { getAdminEnquiries } from "@/features/admin/data";
import { formatBusinessDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Trial Enquiries" };
type Params = Promise<{ status?: string | string[] }>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: Params }) {
  const [result, raw] = await Promise.all([getAdminEnquiries(), searchParams]);
  if (result.status === "error") return <AdminDataError />;
  const status = ["new", "contacted", "converted", "closed"].includes(first(raw.status)) ? first(raw.status) : "";
  const enquiries = result.data.filter((item) => !status || item.status === status);
  return <div className="space-y-10">
    <AdminPageHeader eyebrow="Customer Care" title="Trial enquiries" description="Review consent-backed trial enquiries and move each through the database-enforced lifecycle. Contact details are shown only inside this protected portal." />
    <form method="get" className="flex flex-col gap-3 rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:flex-row sm:items-end"><div className="flex-1"><label htmlFor="status" className="mb-2 block text-sm font-semibold text-brand-strong">Status</label><Select id="status" name="status" defaultValue={status}><option value="">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="converted">Converted</option><option value="closed">Closed</option></Select></div><Button type="submit">Apply</Button>{status ? <Link href={"/admin/enquiries" as Route} className="inline-flex min-h-12 items-center justify-center rounded-pill px-5 text-sm font-semibold text-brand hover:bg-surface-subtle">Clear</Link> : null}</form>
    {enquiries.length === 0 ? <EmptyState title="No enquiries match." description="Validated trial enquiries will appear here after a visitor explicitly consents and submits the public form." /> : <section aria-label="Trial enquiries" className="space-y-4">{enquiries.map((item) => <Link key={item.id} href={`/admin/enquiries/${item.id}` as Route} className="block rounded-2xl border border-brand/10 bg-surface p-5 shadow-card transition-colors hover:bg-sage/30 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><AdminStatus status={item.status} /><span className="text-xs text-muted">{formatBusinessDateTime(item.created_at)}</span></div><h2 className="mt-3 font-display text-2xl font-medium text-brand-strong">{item.name}</h2><p className="mt-2 text-sm text-muted">{item.interestedClass?.name ?? item.interested_practice} · {item.preferred_format} · {item.preferred_time_window}</p></div><span className="text-sm font-semibold text-brand">Review details →</span></div></Link>)}</section>}
  </div>;
}
