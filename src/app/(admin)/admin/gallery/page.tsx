import type { Metadata } from "next";
import Image from "next/image";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { GalleryUploadForm } from "@/components/admin/admin-forms";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminGallery } from "@/features/admin/data";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const result = await getAdminGallery();
  if (result.status === "error") return <AdminDataError />;

  return (
    <div className="space-y-10">
      <AdminPageHeader eyebrow="Media" title="Gallery" description="Upload approved images through the bounded gallery bucket. Public visibility, captions, ordering, and accessible alt text come from the gallery record." />
      <section>
        <h2 className="mb-5 font-display text-2xl font-medium text-brand-strong">Upload an image</h2>
        <GalleryUploadForm />
        <p className="mt-3 text-sm leading-6 text-muted">Video upload is deferred in V1; only the validated 8 MB image path is exposed here.</p>
      </section>
      <section>
        <h2 className="mb-5 font-display text-2xl font-medium text-brand-strong">Media library</h2>
        {result.data.length === 0 ? (
          <EmptyState title="No managed gallery items yet." description="The public gallery continues to identify its development placeholders until approved media is uploaded and published." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.data.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-brand/10 bg-surface shadow-card">
                <div className="relative aspect-[4/3] bg-surface-subtle">
                  <Image src={item.publicUrl} alt={item.alt_text} fill sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <StatusBadge tone={item.archived_at ? "danger" : item.published ? "success" : "warning"}>{item.archived_at ? "archived" : item.published ? "published" : "draft"}</StatusBadge>
                    <span className="text-xs text-muted">Order {item.sort_order}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-brand-strong">{item.alt_text}</p>
                  {item.caption ? <p className="mt-2 text-sm leading-6 text-muted">{item.caption}</p> : null}
                  <ButtonLink href={`/admin/gallery/${item.id}`} variant="secondary" size="sm" className="mt-5 w-full">Manage Item</ButtonLink>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
