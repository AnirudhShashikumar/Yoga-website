import type { Metadata, Route } from "next";
import Link from "next/link";

import { BookingStatusForm } from "@/components/admin/admin-forms";
import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatus } from "@/components/admin/admin-status";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getAdminBookings } from "@/features/admin/data";
import { formatBusinessDateTime, toBusinessDateTimeInput } from "@/lib/dates";

export const metadata: Metadata = { title: "Manage Bookings" };
type Params = Promise<{ status?: string | string[]; class?: string | string[]; date?: string | string[] }>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function AdminBookingsPage({ searchParams }: { searchParams: Params }) {
  const [result, raw] = await Promise.all([getAdminBookings(), searchParams]);
  if (result.status === "error") return <AdminDataError />;
  const status = ["pending", "confirmed", "completed", "cancelled"].includes(first(raw.status)) ? first(raw.status) : "";
  const classes = [...new Map(result.data.flatMap((booking) => booking.session?.class ? [[booking.session.class.id, booking.session.class]] : [])).values()];
  const classId = classes.some((item) => item.id === first(raw.class)) ? first(raw.class) : "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(first(raw.date)) ? first(raw.date) : "";
  const filtered = result.data.filter((booking) => (!status || booking.status === status) && (!classId || booking.session?.class_id === classId) && (!date || (booking.session && toBusinessDateTimeInput(booking.session.starts_at).date === date)));
  return <div className="space-y-10">
    <AdminPageHeader eyebrow="Operations" title="Bookings" description="Manage real customer bookings through the database-enforced lifecycle. Ownership, session identity, and history cannot be rewritten." />
    <form method="get" className="grid gap-4 rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto_auto] xl:items-end"><div><label htmlFor="status" className="mb-2 block text-sm font-semibold text-brand-strong">Status</label><Select id="status" name="status" defaultValue={status}><option value="">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></Select></div><div><label htmlFor="class" className="mb-2 block text-sm font-semibold text-brand-strong">Class</label><Select id="class" name="class" defaultValue={classId}><option value="">All classes</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></div><div><label htmlFor="date" className="mb-2 block text-sm font-semibold text-brand-strong">Session date</label><Input id="date" name="date" type="date" defaultValue={date} /></div><Button type="submit">Apply</Button><Link href={"/admin/bookings" as Route} className="inline-flex min-h-12 items-center justify-center rounded-pill px-5 text-sm font-semibold text-brand hover:bg-surface-subtle">Clear</Link></form>
    {filtered.length === 0 ? <EmptyState title="No bookings match." description="No booking records exist for the selected filters." /> : <section aria-label="Booking records" className="space-y-4">{filtered.map((booking) => <article key={booking.id} className="rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:p-6"><div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]"><div><div className="flex flex-wrap items-center gap-2"><AdminStatus status={booking.status} /><span className="text-xs text-muted">Created {formatBusinessDateTime(booking.created_at)}</span></div><h2 className="mt-3 font-display text-2xl font-medium text-brand-strong">{booking.customer?.full_name || "Customer profile incomplete"}</h2><p className="mt-2 text-sm text-muted">{booking.customer?.phone || "Phone not provided"}</p><Link href={`/admin/customers/${booking.customer_id}` as Route} className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline">View customer</Link></div><div><p className="font-semibold text-brand-strong">{booking.session?.class?.name ?? "Session details unavailable"}</p>{booking.session ? <><p className="mt-2 text-sm text-muted">{formatBusinessDateTime(booking.session.starts_at)}</p><p className="mt-1 text-sm capitalize text-muted">{booking.session.format}</p></> : null}</div><div className="flex flex-wrap items-start gap-2 lg:max-w-64">{booking.status === "pending" ? <><BookingStatusForm id={booking.id} current={booking.status} target="confirmed" /><BookingStatusForm id={booking.id} current={booking.status} target="cancelled" /></> : null}{booking.status === "confirmed" ? <><BookingStatusForm id={booking.id} current={booking.status} target="completed" /><BookingStatusForm id={booking.id} current={booking.status} target="cancelled" /></> : null}</div></div></article>)}</section>}
  </div>;
}
