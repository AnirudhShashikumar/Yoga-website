import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClassCard } from "@/components/classes/class-card";
import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPracticeBySlug } from "@/config/classes";
import { getPublicClassBySlug, getPublicClasses, getPublicSessions } from "@/features/public/data";
import { categoryLabels } from "@/features/public/types";

type ClassPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ClassPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicClassBySlug(slug);
  if (result.status === "error" || !result.data) return { title: "Class not found" };
  return { title: result.data.name, description: result.data.short_description };
}

export default async function ClassDetailPage({ params }: ClassPageProps) {
  const { slug } = await params;
  const [result, classesResult, sessionsResult] = await Promise.all([getPublicClassBySlug(slug), getPublicClasses(), getPublicSessions()]);
  if (result.status === "error") throw new Error("Class catalogue unavailable");
  const practice = result.data;
  if (!practice) notFound();
  const editorial = getPracticeBySlug(practice.slug);
  const related = classesResult.status === "success" ? classesResult.data.filter((item) => item.id !== practice.id).sort((a, b) => Number(b.category === practice.category) - Number(a.category === practice.category)).slice(0, 3) : [];
  const availableSessions = sessionsResult.status === "success" ? sessionsResult.data.filter((session) => session.class.id === practice.id) : [];

  return <>
    <PageHero eyebrow={categoryLabels[practice.category]} title={practice.name} description={practice.short_description} aside={<div className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card"><Badge tone={availableSessions.length ? "sage" : "neutral"}>{availableSessions.length ? `${availableSessions.length} upcoming ${availableSessions.length === 1 ? "session" : "sessions"}` : "No published sessions"}</Badge><p className="mt-4 text-sm leading-6 text-muted">{practice.available_formats.length ? `${practice.available_formats.map((value) => value.charAt(0).toUpperCase() + value.slice(1)).join(" and ")} formats are listed for this class.` : "Confirm current delivery format during your enquiry."}</p>{availableSessions.length ? <ButtonLink href={`/dashboard/schedule?class=${practice.slug}`} className="mt-5 w-full">View Available Sessions</ButtonLink> : null}</div>} />
    <Section><Container><div className="grid gap-12 lg:grid-cols-12 lg:gap-16"><div className="lg:col-span-7"><SectionHeading eyebrow="Practice overview" title={`A considered introduction to ${practice.name}.`} /><p className="mt-6 whitespace-pre-wrap text-lg leading-8 text-muted">{practice.description}</p></div><aside className="rounded-2xl border border-brand/10 bg-surface-subtle p-6 lg:col-span-5 lg:p-8"><h2 className="font-display text-2xl font-medium text-brand-strong">Published details</h2><dl className="mt-6 space-y-5"><div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Delivery</dt><dd className="mt-1 capitalize text-muted">{practice.available_formats.length ? practice.available_formats.join(" · ") : "Confirm during enquiry"}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Level</dt><dd className="mt-1 capitalize text-muted">{practice.levels.length ? practice.levels.join(" · ") : "Suitability discussed individually"}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Schedule</dt><dd className="mt-1 text-muted">{availableSessions.length ? "Real future sessions are available on the schedule." : "No individual session is currently published."}</dd></div></dl></aside></div></Container></Section>
    {editorial ? <Section className="bg-surface-subtle"><Container><div className="grid gap-5 lg:grid-cols-3">{[["Who it may suit", editorial.maySuit], ["What to expect", editorial.whatToExpect], ["Practice qualities", editorial.practiceQualities]].map(([title, items]) => <section key={title as string} className="rounded-2xl border border-brand/10 bg-surface p-6 sm:p-8"><h2 className="font-display text-2xl font-medium text-brand-strong">{title as string}</h2><ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-7 text-muted">{(items as readonly string[]).map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div><p className="mt-8 rounded-2xl border border-brand/10 bg-sky/50 p-5 text-sm leading-6 text-muted">This information describes the practice conservatively and is not medical advice. No therapeutic result or health outcome is promised.</p></Container></Section> : null}
    {related.length ? <Section><Container><SectionHeading eyebrow="Continue exploring" title="Related practices" /><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{related.map((item, index) => <ClassCard key={item.id} practice={item} index={index} />)}</div></Container></Section> : null}
    <ConversionCTA title={`Explore ${practice.name} through a trial enquiry.`} />
  </>;
}
