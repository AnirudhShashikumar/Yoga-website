import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { GalleryArchiveForm, GalleryEditorForm } from "@/components/admin/admin-forms";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { findById, getAdminGallery } from "@/features/admin/data";

export const metadata: Metadata = { title: "Edit Gallery Item" };

export default async function AdminGalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, result] = await Promise.all([params, getAdminGallery()]);
  if (result.status === "error") return <AdminDataError />;
  const item = findById(result.data, id);
  if (!item) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader eyebrow="Gallery" title="Manage image" description="Update accessible description, caption, order, and public visibility. File replacement is not exposed in V1 to avoid orphaned media." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand/10 bg-surface shadow-card">
          <Image src={item.publicUrl} alt={item.alt_text} fill sizes="(max-width: 1023px) 100vw, 60vw" className="object-cover" />
        </div>
        <GalleryEditorForm item={item} />
      </div>
      {!item.archived_at ? (
        <section className="rounded-2xl border border-error/15 bg-error-soft/20 p-6">
          <h2 className="font-display text-2xl font-medium text-brand-strong">Archive</h2>
          <p className="mt-2 text-sm leading-6 text-muted">The database record and Storage object remain retained, while public visibility is removed.</p>
          <div className="mt-5"><GalleryArchiveForm item={item} /></div>
        </section>
      ) : null}
    </div>
  );
}
