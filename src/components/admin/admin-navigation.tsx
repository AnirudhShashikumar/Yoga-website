"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/classes", label: "Classes" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/workshops", label: "Workshops" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
] as const;

function active(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration navigation">
      <ul className={cn(mobile ? "flex min-w-max gap-2 px-5 py-3 sm:px-6" : "space-y-1")}>
        {items.map((item) => {
          const selected = active(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href as Route}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold transition-colors",
                  mobile && "whitespace-nowrap border border-brand/10 bg-surface",
                  selected ? "bg-brand text-white shadow-card" : "text-muted hover:bg-sage/60 hover:text-brand-strong",
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
