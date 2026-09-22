"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { publicNavigation } from "@/config/navigation";
import { primaryCta, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isMenuOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.dataset.menuOpen = "true";
      window.requestAnimationFrame(() => firstLinkRef.current?.focus());
    } else if (!isMenuOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      delete document.documentElement.dataset.menuOpen;
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-background/95 backdrop-blur-lg">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 flex-col py-3">
          <span className="truncate font-display text-lg font-semibold tracking-tight text-brand-strong sm:text-xl">
            {siteConfig.name}
          </span>
          <span className="truncate text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand/75">
            {siteConfig.philosophy}
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden xl:block">
          <ul className="flex items-center gap-5">
            {publicNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-11 items-center text-sm font-semibold text-muted transition-colors hover:text-brand-strong",
                    "after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform hover:after:scale-x-100",
                    isActivePath(pathname, item.href) &&
                      "text-brand-strong after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <ButtonLink href="/book" size="sm">
            {primaryCta}
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
          className="inline-flex size-12 items-center justify-center rounded-full border border-brand/15 bg-surface text-brand-strong shadow-card transition-colors hover:bg-surface-subtle xl:hidden"
        >
          <MenuIcon className="size-6" />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Mobile navigation"
        onCancel={(event) => {
          event.preventDefault();
          setIsMenuOpen(false);
        }}
        onClose={() => setIsMenuOpen(false)}
        className="mobile-nav-dialog m-0 h-dvh max-h-none w-full max-w-none bg-background p-0 text-foreground xl:hidden"
      >
        <div className="flex min-h-full flex-col">
          <div className="flex min-h-20 items-center justify-between border-b border-brand/10 px-5 sm:px-6">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex min-w-0 flex-col"
            >
              <span className="truncate font-display text-lg font-semibold text-brand-strong">
                {siteConfig.name}
              </span>
              <span className="truncate text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand/75">
                {siteConfig.philosophy}
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex size-12 items-center justify-center rounded-full border border-brand/15 bg-surface text-brand-strong"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="flex-1 px-5 py-8 sm:px-6">
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-6">
              {publicNavigation.map((item, index) => (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href as Route}
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex min-h-14 items-center justify-between border-b border-brand/10 font-display text-xl text-brand-strong",
                      isActivePath(pathname, item.href) && "font-semibold",
                    )}
                  >
                    {item.label}
                    <span aria-hidden="true" className="font-body text-base text-brand/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-brand/10 bg-surface-subtle px-5 py-6 sm:px-6">
            <div className="mx-auto max-w-xl">
              <ButtonLink href="/book" size="lg" onClick={() => setIsMenuOpen(false)}>
                {primaryCta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </dialog>
    </header>
  );
}
