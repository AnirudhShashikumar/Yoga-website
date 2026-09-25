import type { Metadata } from "next";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminWorkshops } from "@/features/admin/data";
import { formatBusinessDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Workshops" };
export default async function AdminWorkshopsPage() {
  const result = await getAdminWorkshops();
  if (result.status === "error") return <AdminDataError />;
  return <div className="space-y-10"><AdminPageHeader eyebrow="Content" title="Workshops" description="Draft and publish only confirmed workshop details. Published records feed the public workshops page." action={<ButtonLink href="/admin/workshops/new">New Workshop</ButtonLink>} />{result.data.length === 0 ? <EmptyState title="No workshops yet." description="The public page remains truthful and empty until a real workshop is confirmed." action={<ButtonLink href="/admin/workshops/new">Create Workshop</ButtonLink>} /> : <section className="grid gap-4 md:grid-cols-2">{result.data.map((item) => <article key={item.id} className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card"><div className="flex items-center justify-between gap-2"><StatusBadge tone={item.archived_at ? "danger" : item.published ? "success" : "warning"}>{item.archived_at ? "archived" : item.published ? "published" : "draft"}</StatusBadge>{item.format ? <StatusBadge tone="neutral">{item.format}</StatusBadge> : null}</div><h2 className="mt-5 font-display text-2xl font-medium text-brand-strong">{item.title}</h2><p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p><p className="mt-4 text-sm font-semibold text-brand-strong">{item.starts_at ? formatBusinessDateTime(item.starts_at) : "Date not scheduled"}</p><ButtonLink href={`/admin/workshops/${item.id}`} variant="secondary" size="sm" className="mt-6 w-full">Manage Workshop</ButtonLink></article>)}</section>}</div>;
}
