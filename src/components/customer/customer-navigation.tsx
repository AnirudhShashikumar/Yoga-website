"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/bookings", label: "My Bookings" },
  { href: "/dashboard/classes", label: "Explore Classes" },
  { href: "/dashboard/schedule", label: "Schedule" },
  { href: "/dashboard/profile", label: "Profile" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function CustomerNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Customer account navigation">
      <ul
        className={cn(
          mobile
            ? "flex min-w-max gap-2 px-5 py-3 sm:px-6"
            : "space-y-1",
        )}
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href as Route}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold transition-colors",
                  mobile && "whitespace-nowrap border border-brand/10 bg-surface",
                  active
                    ? "bg-brand text-white shadow-card"
                    : "text-muted hover:bg-sage/60 hover:text-brand-strong",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
