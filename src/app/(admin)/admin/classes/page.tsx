import type { Metadata } from "next";
import Link from "next/link";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminClasses } from "@/features/admin/data";

export const metadata: Metadata = { title: "Manage Classes" };

export default async function AdminClassesPage() {
  const result = await getAdminClasses();
  if (result.status === "error") return <AdminDataError />;
  return <div className="space-y-10">
    <AdminPageHeader eyebrow="Catalogue" title="Classes" description="Manage the same class records used by public and customer catalogues. Slugs stay immutable after creation so published links remain stable." action={<ButtonLink href="/admin/classes/new">New Class</ButtonLink>} />
    {result.data.length === 0 ? <EmptyState title="No classes yet." description="Create the first class only from approved business content." action={<ButtonLink href="/admin/classes/new">Create Class</ButtonLink>} /> : <section aria-label="All classes" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{result.data.map((item) => <article key={item.id} className="flex flex-col rounded-2xl border border-brand/10 bg-surface p-6 shadow-card"><div className="flex flex-wrap items-center justify-between gap-2"><StatusBadge tone={item.archived_at ? "danger" : item.published ? "success" : "warning"}>{item.archived_at ? "archived" : item.published ? "published" : "draft"}</StatusBadge><span className="text-xs font-semibold text-muted">Order {item.sort_order}</span></div><h2 className="mt-5 font-display text-2xl font-medium text-brand-strong">{item.name}</h2><p className="mt-2 text-sm text-muted">/{item.slug}</p><p className="mt-4 flex-1 text-sm leading-6 text-muted">{item.short_description}</p><div className="mt-5 flex flex-wrap gap-2">{item.levels.map((value) => <StatusBadge key={value} tone="info">{value}</StatusBadge>)}{item.available_formats.map((value) => <StatusBadge key={value} tone="neutral">{value}</StatusBadge>)}</div><div className="mt-6 flex items-center justify-between border-t border-brand/10 pt-5"><Link href={`/classes/${item.slug}`} className="text-sm font-semibold text-brand hover:underline">Public page</Link><ButtonLink href={`/admin/classes/${item.id}`} variant="secondary" size="sm">Manage</ButtonLink></div></article>)}</section>}
  </div>;
}
