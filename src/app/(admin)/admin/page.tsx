import type { Metadata, Route } from "next";
import Link from "next/link";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatus } from "@/components/admin/admin-status";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getAdminOverview } from "@/features/admin/data";
import { formatBusinessDateTime, getBusinessDayRange, getCurrentTimestamp } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const result = await getAdminOverview();
  if (result.status === "error") return <AdminDataError />;
  const { counts, sessions, bookings, enquiries } = result.data;
  const now = getCurrentTimestamp();
  const day = getBusinessDayRange();
  const todaySessions = sessions.filter((session) => session.starts_at >= day.start && session.starts_at < day.end && !session.archived_at);
  const upcoming = sessions.filter((session) => new Date(session.starts_at).getTime() > now && session.status !== "cancelled" && !session.archived_at).slice(0, 5);
  const stats: Array<[string, number, Route]> = [["Customers", counts.customers, "/admin/customers" as Route], ["Bookings", counts.bookings, "/admin/bookings" as Route], ["Sessions", counts.sessions, "/admin/schedule" as Route], ["Enquiries", counts.enquiries, "/admin/enquiries" as Route], ["Classes", counts.classes, "/admin/classes" as Route], ["Workshops", counts.workshops, "/admin/workshops" as Route], ["Gallery items", counts.gallery, "/admin/gallery" as Route]];
  const quickActions: Array<[string, `/${string}`]> = [["Create Class", "/admin/classes/new"], ["Create Session", "/admin/schedule/new"], ["Review Enquiries", "/admin/enquiries"], ["Upload Gallery Image", "/admin/gallery"]];

  return (
    <div className="space-y-10">
      <AdminPageHeader eyebrow="Administration" title="A clear view of the practice." description="Every number and record below comes from the live Supabase model. Financial and unsupported capacity analytics are intentionally absent." action={<ButtonLink href="/admin/schedule/new">New Session</ButtonLink>} />
      <section aria-label="Business record counts" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, href]) => (
          <Link key={label} href={href as Route} className="rounded-2xl border border-brand/10 bg-surface p-5 shadow-card transition-colors hover:bg-sage/35"><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/65">{label}</p><p className="mt-3 font-display text-4xl font-medium text-brand-strong">{value}</p></Link>
        ))}
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="today-heading"><div className="mb-4 flex items-end justify-between gap-4"><h2 id="today-heading" className="font-display text-2xl font-medium text-brand-strong">Today’s sessions</h2><span className="text-sm text-muted">{day.date}</span></div>{todaySessions.length ? <div className="space-y-3">{todaySessions.map((session) => <Card key={session.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-brand-strong">{session.class?.name ?? "Unavailable class"}</p><p className="mt-1 text-sm text-muted">{formatBusinessDateTime(session.starts_at)} · {session.format}</p></div><AdminStatus status={session.status} /></div><p className="mt-3 text-sm text-muted">{session.activeBookingCount} active {session.activeBookingCount === 1 ? "booking" : "bookings"}</p></Card>)}</div> : <EmptyState title="No sessions today." description="Create a real session only after its date, time, class, and format are confirmed." />}</section>
        <section aria-labelledby="upcoming-heading"><div className="mb-4 flex items-end justify-between gap-4"><h2 id="upcoming-heading" className="font-display text-2xl font-medium text-brand-strong">Upcoming sessions</h2><Link href={"/admin/schedule" as Route} className="text-sm font-semibold text-brand hover:underline">View schedule</Link></div>{upcoming.length ? <div className="space-y-3">{upcoming.map((session) => <Card key={session.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-brand-strong">{session.class?.name ?? "Unavailable class"}</p><p className="mt-1 text-sm text-muted">{formatBusinessDateTime(session.starts_at)} · {session.format}</p></div><AdminStatus status={session.status} /></div></Card>)}</div> : <EmptyState title="No upcoming sessions." description="The live schedule is empty. No placeholder sessions have been added." />}</section>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="recent-bookings-heading"><div className="mb-4 flex items-end justify-between gap-4"><h2 id="recent-bookings-heading" className="font-display text-2xl font-medium text-brand-strong">Recent bookings</h2><Link href={"/admin/bookings" as Route} className="text-sm font-semibold text-brand hover:underline">Manage</Link></div>{bookings.length ? <div className="space-y-3">{bookings.slice(0, 5).map((booking) => <Card key={booking.id} className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-brand-strong">{booking.customer?.full_name || "Customer profile incomplete"}</p><p className="mt-1 text-sm text-muted">{booking.session?.class?.name ?? "Class unavailable"}</p></div><AdminStatus status={booking.status} /></div></Card>)}</div> : <EmptyState title="No bookings yet." description="Bookings will appear only after a customer selects a real published session." />}</section>
        <section aria-labelledby="recent-enquiries-heading"><div className="mb-4 flex items-end justify-between gap-4"><h2 id="recent-enquiries-heading" className="font-display text-2xl font-medium text-brand-strong">Recent enquiries</h2><Link href={"/admin/enquiries" as Route} className="text-sm font-semibold text-brand hover:underline">Manage</Link></div>{enquiries.length ? <div className="space-y-3">{enquiries.slice(0, 5).map((enquiry) => <Card key={enquiry.id} className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-brand-strong">{enquiry.name}</p><p className="mt-1 text-sm text-muted">{enquiry.interestedClass?.name ?? enquiry.interested_practice}</p></div><AdminStatus status={enquiry.status} /></div></Card>)}</div> : <EmptyState title="No enquiries yet." description="Validated public trial enquiries will appear here with their consent record." />}</section>
      </div>
      <section aria-labelledby="quick-actions-heading"><h2 id="quick-actions-heading" className="font-display text-2xl font-medium text-brand-strong">Quick management</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{quickActions.map(([label, href]) => <ButtonLink key={href} href={href} variant="secondary" className="w-full">{label}</ButtonLink>)}</div></section>
    </div>
  );
}
