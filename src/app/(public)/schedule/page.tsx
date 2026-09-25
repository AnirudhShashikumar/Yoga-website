import type { Metadata } from "next";

import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { CalendarIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/status-badge";
import { siteConfig } from "@/config/site";
import { getPublicSessions } from "@/features/public/data";
import { formatBusinessDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Schedule", description: "View real published Prabha Yogashala sessions and confirmed broad practice windows." };

export default async function SchedulePage() {
  const sessions = await getPublicSessions();
  const available = sessions.status === "success" ? sessions.data : [];
  return <>
    <PageHero eyebrow="Schedule" title={available.length ? "Real sessions, published with care." : "A broad morning and evening rhythm."} description={available.length ? "Every occurrence below is a future published database record. Times are shown in India Standard Time." : "No individual session is currently published. The two broad windows below are the only confirmed timing information."} actions={<><ButtonLink href="/book">Book a Trial Class</ButtonLink><ButtonLink href="/contact" variant="secondary">Ask a Question</ButtonLink></>} />
    {sessions.status === "error" ? <Section><Container><EmptyState title="The live schedule is temporarily unavailable." description="Please try again later or contact Prabha Yogashala directly." /></Container></Section> : available.length ? <Section><Container><div className="space-y-4">{available.map((session) => <article key={session.id} className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap gap-2"><StatusBadge tone="success">Published</StatusBadge><StatusBadge tone="neutral">{session.format}</StatusBadge></div><h2 className="mt-4 font-display text-2xl font-medium text-brand-strong">{session.class.name}</h2><p className="mt-2 text-sm text-muted">{formatBusinessDateTime(session.starts_at)} – {formatBusinessDateTime(session.ends_at)}</p></div><div className="flex flex-col gap-2 sm:items-end"><ButtonLink href={`/login?next=${encodeURIComponent(`/dashboard/schedule?class=${session.class.slug}`)}`}>Sign In to Book</ButtonLink><span className="text-xs text-muted">Availability is confirmed only after booking succeeds.</span></div></div></article>)}</div></Container></Section> : <Section><Container><div className="grid gap-5 md:grid-cols-2">{[["Morning window", siteConfig.availability.morning, "bg-sage"], ["Evening window", siteConfig.availability.evening, "bg-sky"]].map(([label, time, tone]) => <article key={label} className={`${tone} rounded-[2rem] border border-brand/10 p-7 sm:p-10`}><CalendarIcon className="size-8 text-brand" /><p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</p><h2 className="mt-3 font-display text-4xl font-medium text-brand-strong sm:text-5xl">{time}</h2><p className="mt-4 text-base leading-7 text-muted">Individual practices and exact start times are not yet published.</p></article>)}</div><div className="mt-10"><EmptyState title="No individual sessions are published yet." description="Days, durations, capacities, and availability remain intentionally absent until they are verified." /></div></Container></Section>}
    <ConversionCTA title={available.length ? "Choose a real session or begin with an enquiry." : "Find a time within the confirmed windows."} />
  </>;
}
