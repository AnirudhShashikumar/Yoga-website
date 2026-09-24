import type { Metadata, Route } from "next";
import Link from "next/link";

import { CustomerPageHeader } from "@/components/customer/customer-page-header";
import { CustomerDataError } from "@/components/customer/data-state";
import { SessionCard } from "@/components/customer/session-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { getCustomerBookings, getPublishedClasses, getPublishedSessions } from "@/features/customer/data";

export const metadata: Metadata = { title: "Schedule" };

type ScheduleSearchParams = Promise<{ format?: string | string[] | undefined; class?: string | string[] | undefined }>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function CustomerSchedulePage({ searchParams }: { searchParams: ScheduleSearchParams }) {
  const [sessionsResult, classesResult, bookingsResult, rawFilters] = await Promise.all([
    getPublishedSessions(),
    getPublishedClasses(),
    getCustomerBookings(),
    searchParams,
  ]);
  if (sessionsResult.status === "error" || classesResult.status === "error" || bookingsResult.status === "error") return <CustomerDataError />;

  const requestedFormat = first(rawFilters.format);
  const requestedClass = first(rawFilters.class);
  const format = requestedFormat === "online" || requestedFormat === "offline" ? requestedFormat : "";
  const classSlug = classesResult.data.some((item) => item.slug === requestedClass) ? requestedClass : "";
  const filtered = sessionsResult.data.filter(
    (session) => (!format || session.format === format) && (!classSlug || session.class.slug === classSlug),
  );
  const bookedSessionIds = new Set(
    bookingsResult.data.flatMap((booking) =>
      booking.session && (booking.status === "pending" || booking.status === "confirmed")
        ? [booking.session.id]
        : [],
    ),
  );

  return (
    <div className="space-y-10">
      <CustomerPageHeader
        eyebrow="Schedule"
        title="Real sessions, ready when published."
        description="Times are shown in your device timezone. Only future, published sessions for published classes are available to book."
      />

      <form method="get" className="grid gap-4 rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto_auto] xl:items-end">
        <div>
          <label htmlFor="scheduleFormat" className="mb-2 block text-sm font-semibold text-brand-strong">Format</label>
          <Select id="scheduleFormat" name="format" defaultValue={format}>
            <option value="">All formats</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </Select>
        </div>
        <div>
          <label htmlFor="scheduleClass" className="mb-2 block text-sm font-semibold text-brand-strong">Class</label>
          <Select id="scheduleClass" name="class" defaultValue={classSlug}>
            <option value="">All classes</option>
            {classesResult.data.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
          </Select>
        </div>
        <Button type="submit" className="w-full">Apply Filters</Button>
        <Link href={"/dashboard/schedule" as Route} className="inline-flex min-h-12 items-center justify-center rounded-pill px-5 text-sm font-semibold text-brand hover:bg-surface-subtle">Clear</Link>
      </form>

      {sessionsResult.data.length === 0 ? (
        <EmptyState
          title="No sessions are published yet."
          description="The schedule is connected to the live database and will show booking options only after a real class session is published."
          action={<ButtonLink href="/dashboard/classes">Explore Classes</ButtonLink>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No sessions match these filters."
          description="Try another class or format, or clear the filters to see all currently published sessions."
          action={<ButtonLink href="/dashboard/schedule" variant="secondary">Clear Filters</ButtonLink>}
        />
      ) : (
        <section aria-label="Available class sessions" className="space-y-4">
          {filtered.map((session) => <SessionCard key={session.id} session={session} alreadyBooked={bookedSessionIds.has(session.id)} />)}
        </section>
      )}
    </div>
  );
}
