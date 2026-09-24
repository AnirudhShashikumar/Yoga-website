import type { Metadata } from "next";
import Link from "next/link";

import { CustomerPageHeader } from "@/components/customer/customer-page-header";
import { CustomerDataError } from "@/components/customer/data-state";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPublishedClasses, getPublishedSessions } from "@/features/customer/data";

export const metadata: Metadata = { title: "Explore Classes" };

const categoryLabels = {
  foundational: "Foundational",
  dynamic: "Dynamic",
  mind_breath: "Mind & Breath",
  specialized: "Specialized",
  personal_groups: "Personal & Groups",
} as const;

export default async function CustomerClassesPage() {
  const [classesResult, sessionsResult] = await Promise.all([getPublishedClasses(), getPublishedSessions()]);
  if (classesResult.status === "error" || sessionsResult.status === "error") return <CustomerDataError />;

  const sessionsByClass = new Map<string, number>();
  for (const session of sessionsResult.data) {
    sessionsByClass.set(session.class.id, (sessionsByClass.get(session.class.id) ?? 0) + 1);
  }

  return (
    <div className="space-y-10">
      <CustomerPageHeader
        eyebrow="Explore Classes"
        title="Choose a practice with clarity."
        description="This catalogue comes directly from the published Supabase class records. Session availability appears only when a real occurrence has been scheduled."
      />

      {sessionsResult.data.length === 0 ? (
        <div role="status" className="rounded-2xl border border-brand/10 bg-sky/50 p-5 text-sm leading-6 text-muted">
          No class sessions are currently published. You can still explore all class descriptions; booking controls will appear after a real session is added.
        </div>
      ) : null}

      <section aria-label="Published classes" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {classesResult.data.map((classItem) => {
          const sessionCount = sessionsByClass.get(classItem.id) ?? 0;
          return (
            <article key={classItem.id} className="flex min-h-full flex-col rounded-2xl border border-brand/10 bg-surface p-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge tone="neutral">{categoryLabels[classItem.category]}</StatusBadge>
                {sessionCount > 0 ? <StatusBadge tone="success">{sessionCount} {sessionCount === 1 ? "session" : "sessions"}</StatusBadge> : null}
              </div>
              <h2 className="mt-5 font-display text-2xl font-medium text-brand-strong">{classItem.name}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted">{classItem.shortDescription}</p>
              {classItem.levels.length > 0 || classItem.availableFormats.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {classItem.levels.map((level) => <StatusBadge key={level} tone="info">{level}</StatusBadge>)}
                  {classItem.availableFormats.map((format) => <StatusBadge key={format} tone="success">{format}</StatusBadge>)}
                </div>
              ) : null}
              {sessionCount === 0 ? (
                <p className="mt-4 rounded-xl bg-surface-subtle px-4 py-3 text-sm leading-6 text-muted">No published sessions for this class yet.</p>
              ) : null}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/classes/${classItem.slug}`} variant="secondary" size="sm" className="w-full">Class Details</ButtonLink>
                {sessionCount > 0 ? <ButtonLink href={`/dashboard/schedule?class=${classItem.slug}`} size="sm" className="w-full">Book a Session</ButtonLink> : null}
              </div>
            </article>
          );
        })}
      </section>

      <p className="text-center text-sm text-muted">
        Looking for the public catalogue?{" "}
        <Link href="/classes" className="font-semibold text-brand underline-offset-4 hover:underline">View public classes</Link>
      </p>
    </div>
  );
}
