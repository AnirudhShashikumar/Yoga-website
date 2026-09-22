import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { homeMedia } from "@/config/media";

const concepts = ["Movement", "Breath", "Stillness"] as const;

export function GalleryPreview() {
  return (
    <Section className="bg-surface-subtle">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Gallery"
            title="The feeling of practice, held with restraint."
            description="A quiet visual space for movement, breath, and stillness."
          />
          <ButtonLink href="/gallery" variant="secondary">
            View Gallery
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-12">
          {homeMedia.gallery.map((media, index) => (
            <figure
              key={media.src}
              className={index === 0 ? "md:col-span-6" : "md:col-span-3"}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand/10 bg-surface shadow-card md:aspect-[3/4]">
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
                <figcaption className="absolute inset-x-4 bottom-4 rounded-xl bg-background/90 px-4 py-3 font-display text-lg font-medium text-brand-strong backdrop-blur">
                  {concepts[index]}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
