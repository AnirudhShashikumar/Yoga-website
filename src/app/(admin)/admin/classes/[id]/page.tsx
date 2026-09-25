import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClassArchiveForm, ClassEditorForm } from "@/components/admin/admin-forms";
import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminClasses, findById } from "@/features/admin/data";

export const metadata: Metadata = { title: "Edit Class" };

export default async function AdminClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, result] = await Promise.all([params, getAdminClasses()]);
  if (result.status === "error") return <AdminDataError />;
  const item = findById(result.data, id);
  if (!item) notFound();
  return <div className="space-y-8"><AdminPageHeader eyebrow="Catalogue" title={item.name} description="Edit approved catalogue content and visibility. Future published sessions must be resolved before this class can be hidden or archived." /><ClassEditorForm classItem={item} /><section className="rounded-2xl border border-error/15 bg-error-soft/20 p-6"><h2 className="font-display text-2xl font-medium text-brand-strong">Archive</h2><p className="mt-2 text-sm leading-6 text-muted">Archiving removes the class from public discovery without deleting history.</p><div className="mt-5"><ClassArchiveForm classItem={item} /></div></section></div>;
}
