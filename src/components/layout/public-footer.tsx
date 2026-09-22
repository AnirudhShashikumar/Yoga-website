import type { Route } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Classes", href: "/classes" },
      { label: "Schedule", href: "/schedule" },
      { label: "Workshops", href: "/workshops" },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Gallery", href: "/gallery" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Book a Trial Class", href: "/book" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-brand/10 bg-surface-subtle">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-20">
          <div>
            <Link href="/" className="font-display text-2xl font-semibold text-brand-strong">
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-md text-base leading-7 text-muted">
              Yoga practice for ages 10 and above, offered online and offline for
              beginner, intermediate, and advanced practitioners.
            </p>
            <p className="mt-6 font-display text-xl italic text-brand">
              {siteConfig.philosophy}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-brand-strong">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href as Route}
                        className="inline-flex min-h-11 items-center text-sm font-medium text-muted transition-colors hover:text-brand-strong"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-brand/10 pt-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={siteConfig.contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center font-semibold hover:text-brand-strong"
            >
              Instagram
            </a>
            <a
              href={siteConfig.contact.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center font-semibold hover:text-brand-strong"
            >
              YouTube
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
