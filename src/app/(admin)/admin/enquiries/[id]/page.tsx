import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EnquiryStatusForm } from "@/components/admin/admin-forms";
import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatus } from "@/components/admin/admin-status";
import { Card } from "@/components/ui/card";
import { findById, getAdminEnquiries } from "@/features/admin/data";
import { formatBusinessDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Enquiry Details" };

export default async function AdminEnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, result] = await Promise.all([params, getAdminEnquiries()]);
  if (result.status === "error") return <AdminDataError />;
  const item = findById(result.data, id);
  if (!item) notFound();
  return <div className="space-y-8">
    <AdminPageHeader eyebrow="Trial Enquiry" title={item.name} description="Use these details only to respond to the consented enquiry. Do not copy or expose customer data unnecessarily." />
    <Card><div className="flex flex-wrap items-center justify-between gap-3"><AdminStatus status={item.status} /><span className="text-sm text-muted">Submitted {formatBusinessDateTime(item.created_at)}</span></div><dl className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div><dt className="text-sm text-muted">Email</dt><dd className="mt-1 break-all font-semibold text-brand-strong">{item.email}</dd></div><div><dt className="text-sm text-muted">Phone</dt><dd className="mt-1 font-semibold text-brand-strong">{item.phone}</dd></div><div><dt className="text-sm text-muted">Age</dt><dd className="mt-1 font-semibold text-brand-strong">{item.age}</dd></div><div><dt className="text-sm text-muted">Practice</dt><dd className="mt-1 font-semibold text-brand-strong">{item.interestedClass?.name ?? item.interested_practice}</dd></div><div><dt className="text-sm text-muted">Experience</dt><dd className="mt-1 font-semibold capitalize text-brand-strong">{item.experience_level}</dd></div><div><dt className="text-sm text-muted">Preference</dt><dd className="mt-1 font-semibold capitalize text-brand-strong">{item.preferred_format} · {item.preferred_time_window}</dd></div><div className="sm:col-span-2 lg:col-span-3"><dt className="text-sm text-muted">Message</dt><dd className="mt-2 whitespace-pre-wrap leading-7 text-brand-strong">{item.message || "No additional message."}</dd></div><div className="sm:col-span-2 lg:col-span-3"><dt className="text-sm text-muted">Consent record</dt><dd className="mt-1 text-sm text-brand-strong">{item.consent_given && item.consented_at ? `Affirmative consent recorded ${formatBusinessDateTime(item.consented_at)} via ${item.consent_source ?? "recorded source"}.` : "Consent record unavailable."}</dd></div></dl></Card>
    <section className="rounded-2xl border border-brand/10 bg-surface p-6"><h2 className="font-display text-2xl font-medium text-brand-strong">Update status</h2><div className="mt-5 flex flex-wrap gap-3">{item.status === "new" ? <><EnquiryStatusForm id={item.id} current={item.status} target="contacted" /><EnquiryStatusForm id={item.id} current={item.status} target="closed" /></> : null}{item.status === "contacted" ? <><EnquiryStatusForm id={item.id} current={item.status} target="converted" /><EnquiryStatusForm id={item.id} current={item.status} target="closed" /></> : null}{item.status === "converted" || item.status === "closed" ? <p className="text-sm text-muted">This lifecycle is complete; the record remains retained.</p> : null}</div></section>
  </div>;
}
