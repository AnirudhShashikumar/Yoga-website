import type { Metadata } from "next";
import Image from "next/image";

import { ConversionCTA } from "@/components/public/conversion-cta";
import { PageHero } from "@/components/public/page-hero";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { publicMedia } from "@/config/media";
import { getPublicGallery } from "@/features/public/data";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A developing visual gallery for Prabha Yogashala, awaiting approved production photography and video.",
};

const labels = ["Movement", "Breath", "Stillness", "Balance", "Flow", "Rest"] as const;

export default async function GalleryPage() {
  const result = await getPublicGallery();
  const managedItems = result.status === "success" ? result.data : [];
  return (
    <>
      <PageHero eyebrow="Gallery" title={managedItems.length ? "A visual record of the practice." : "A visual space ready for the real practice."} description={managedItems.length ? "Every image below is an approved, published gallery record." : "Approved photography and video have not yet been supplied. The abstract studies below are clearly identified development placeholders, not images of Prabha Yogashala facilities, students, or events."} />
      <Section>
        <Container>
          <div className="grid auto-rows-[18rem] gap-5 md:grid-cols-2 lg:grid-cols-12">
            {(managedItems.length ? managedItems.map((item) => ({ src: item.publicUrl, alt: item.alt_text, caption: item.caption, managed: true })) : publicMedia.gallery.map((media, index) => ({ ...media, caption: labels[index], managed: false }))).map((media, index) => (
              <figure
                key={media.src}
                className={index === 0 || index === 5 ? "group relative overflow-hidden rounded-2xl border border-brand/10 bg-surface shadow-card lg:col-span-7" : "group relative overflow-hidden rounded-2xl border border-brand/10 bg-surface shadow-card lg:col-span-5"}
              >
                <Image src={media.src} alt={media.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 58vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl bg-background/90 px-4 py-3 backdrop-blur">
                  <span className="font-display text-lg text-brand-strong">{media.caption || media.alt}</span>
                  {!media.managed ? <Badge tone="neutral">Placeholder</Badge> : null}
                </figcaption>
              </figure>
            ))}
          </div>
          {!managedItems.length ? <div className="mt-10 rounded-2xl border border-brand/10 bg-surface-subtle p-6 text-sm leading-6 text-muted sm:p-8">
            Production replacement is centralized through <code className="rounded bg-surface px-2 py-1 text-brand-strong">src/config/media.ts</code>. Final assets need confirmed usage rights, captions, ordering, and meaningful alt text where appropriate.
          </div> : null}
        </Container>
      </Section>
      <ConversionCTA title="Experience the practice beyond the gallery." />
    </>
  );
}
