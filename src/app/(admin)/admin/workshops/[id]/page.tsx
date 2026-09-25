import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkshopArchiveForm, WorkshopEditorForm } from "@/components/admin/admin-forms";
import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { findById, getAdminWorkshops } from "@/features/admin/data";
export const metadata: Metadata = { title: "Edit Workshop" };
export default async function AdminWorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) { const [{ id }, result] = await Promise.all([params, getAdminWorkshops()]); if (result.status === "error") return <AdminDataError />; const item = findById(result.data, id); if (!item) notFound(); return <div className="space-y-8"><AdminPageHeader eyebrow="Workshops" title={item.title} description="Update the approved workshop record. Its public slug is intentionally immutable in the V1 editor." /><WorkshopEditorForm workshop={item} />{!item.archived_at ? <section className="rounded-2xl border border-error/15 bg-error-soft/20 p-6"><h2 className="font-display text-2xl font-medium text-brand-strong">Archive</h2><p className="mt-2 text-sm leading-6 text-muted">Archiving removes this workshop from public discovery without deleting its record.</p><div className="mt-5"><WorkshopArchiveForm workshop={item} /></div></section> : null}</div>; }
