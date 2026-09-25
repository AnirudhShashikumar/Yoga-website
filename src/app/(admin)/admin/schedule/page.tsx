import type { Metadata, Route } from "next";
import Link from "next/link";

import { SessionArchiveForm, SessionStatusForm } from "@/components/admin/admin-forms";
import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatus } from "@/components/admin/admin-status";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { getAdminClasses, getAdminSessions } from "@/features/admin/data";
import { formatBusinessDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Manage Schedule" };
type Params = Promise<{ status?: string | string[]; class?: string | string[] }>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function AdminSchedulePage({ searchParams }: { searchParams: Params }) {
  const [sessionResult, classResult, raw] = await Promise.all([getAdminSessions(), getAdminClasses(), searchParams]);
  if (sessionResult.status === "error" || classResult.status === "error") return <AdminDataError />;
  const status = ["draft", "published", "cancelled", "completed", "archived"].includes(first(raw.status)) ? first(raw.status) : "";
  const classId = classResult.data.some((item) => item.id === first(raw.class)) ? first(raw.class) : "";
  const filtered = sessionResult.data.filter((session) => (!status || (status === "archived" ? Boolean(session.archived_at) : session.status === status && !session.archived_at)) && (!classId || session.class_id === classId));
  return <div className="space-y-10">
    <AdminPageHeader eyebrow="Operations" title="Schedule" description="Create real session occurrences in India Standard Time. Booked session identity, timing, and format cannot be rewritten." action={<ButtonLink href="/admin/schedule/new">New Session</ButtonLink>} />
    <form method="get" className="grid gap-4 rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end"><div><label htmlFor="status" className="mb-2 block text-sm font-semibold text-brand-strong">Status</label><Select id="status" name="status" defaultValue={status}><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option><option value="archived">Archived</option></Select></div><div><label htmlFor="class" className="mb-2 block text-sm font-semibold text-brand-strong">Class</label><Select id="class" name="class" defaultValue={classId}><option value="">All classes</option>{classResult.data.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></div><Button type="submit">Apply</Button><Link href={"/admin/schedule" as Route} className="inline-flex min-h-12 items-center justify-center rounded-pill px-5 text-sm font-semibold text-brand hover:bg-surface-subtle">Clear</Link></form>
    {filtered.length === 0 ? <EmptyState title="No sessions match." description="No placeholder occurrences are shown. Create a real session or change the filters." action={<ButtonLink href="/admin/schedule/new">Create Session</ButtonLink>} /> : <section aria-label="Session records" className="space-y-4">{filtered.map((session) => <article key={session.id} className="rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><AdminStatus status={session.archived_at ? "archived" : session.status} /><span className="text-sm capitalize text-muted">{session.format}</span></div><h2 className="mt-3 font-display text-2xl font-medium text-brand-strong">{session.class?.name ?? "Unavailable class"}</h2><p className="mt-2 text-sm text-muted">{formatBusinessDateTime(session.starts_at)} – {formatBusinessDateTime(session.ends_at)}</p><p className="mt-2 text-sm text-muted">{session.activeBookingCount} active / {session.totalBookingCount} total bookings · {session.capacity ? `capacity ${session.capacity}` : "capacity not set"}</p></div><div className="flex flex-wrap items-start gap-2"><ButtonLink href={`/admin/schedule/${session.id}`} variant="secondary" size="sm">Edit</ButtonLink>{!session.archived_at && session.status === "draft" ? <><SessionStatusForm session={session} target="published" /><SessionStatusForm session={session} target="cancelled" /></> : null}{!session.archived_at && session.status === "published" ? <><SessionStatusForm session={session} target="completed" /><SessionStatusForm session={session} target="cancelled" /></> : null}{!session.archived_at && (session.status === "cancelled" || session.status === "completed") ? <SessionArchiveForm session={session} /> : null}</div></div></article>)}</section>}
  </div>;
}
