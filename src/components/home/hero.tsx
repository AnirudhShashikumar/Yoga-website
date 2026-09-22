import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { homeMedia } from "@/config/media";
import { primaryCta, siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-20">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-28 size-80 rounded-full bg-sky/55 blur-3xl"
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Badge tone="sage">Yoga for ages 10 and above</Badge>
            <h1 className="mt-6 max-w-4xl font-display text-[2.55rem] font-medium leading-[1.08] tracking-[-0.025em] text-brand-strong sm:text-5xl lg:text-6xl">
              A steady practice for a positive and healthy life.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {siteConfig.name} welcomes beginner, intermediate, and advanced
              practitioners through online and offline yoga sessions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/book" size="lg" className="w-full sm:w-auto">
                {primaryCta}
              </ButtonLink>
              <ButtonLink
                href="/classes"
                variant="secondary"
                size="lg"
                className="group w-full sm:w-auto"
              >
                Explore Classes
                <ArrowRightIcon className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-brand/10 pt-6 text-sm font-semibold text-brand">
              <span>Online sessions</span>
              <span>Offline sessions</span>
              <span>Trial classes available</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand/10 bg-surface shadow-floating">
              <Image
                src={homeMedia.hero.src}
                alt={homeMedia.hero.alt}
                fill
                priority
                sizes="(max-width: 1023px) 90vw, 38vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-strong/20 to-transparent"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-brand/10 bg-surface/95 p-5 shadow-floating backdrop-blur sm:left-auto sm:right-6 sm:max-w-[17rem]">
              <p className="font-display text-xl font-medium text-brand-strong">
                {siteConfig.philosophy}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                A welcoming path for every level of practice.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

