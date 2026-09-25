import type { Metadata, Route } from "next";
import Link from "next/link";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminCustomers } from "@/features/admin/data";
import { formatBusinessDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Customers" };
type Params = Promise<{ q?: string | string[] }>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function AdminCustomersPage({ searchParams }: { searchParams: Params }) {
  const [result, raw] = await Promise.all([getAdminCustomers(), searchParams]);
  if (result.status === "error") return <AdminDataError />;
  const query = first(raw.q).trim().toLowerCase();
  const customers = result.data.filter((customer) => !query || customer.full_name?.toLowerCase().includes(query) || customer.email?.toLowerCase().includes(query) || customer.phone?.toLowerCase().includes(query));
  return <div className="space-y-10">
    <AdminPageHeader eyebrow="Accounts" title="Customers" description="Search the customer directory and review supported profile fields and booking history. Role management is intentionally unavailable." />
    <form method="get" className="flex flex-col gap-3 rounded-2xl border border-brand/10 bg-surface p-5 shadow-card sm:flex-row"><label htmlFor="q" className="sr-only">Search customers</label><Input id="q" name="q" defaultValue={first(raw.q)} placeholder="Search name, email, or phone" className="flex-1" /><Button type="submit">Search</Button>{query ? <Link href={"/admin/customers" as Route} className="inline-flex min-h-12 items-center justify-center rounded-pill px-5 text-sm font-semibold text-brand hover:bg-surface-subtle">Clear</Link> : null}</form>
    {customers.length === 0 ? <EmptyState title={result.data.length ? "No customers match." : "No customer accounts yet."} description={result.data.length ? "Try a different name, email, or phone search." : "Customers appear only after a legitimate account registration creates its profile and customer role."} /> : <section aria-label="Customer directory" className="grid gap-4 lg:grid-cols-2">{customers.map((customer) => <article key={customer.id} className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-2xl font-medium text-brand-strong">{customer.full_name || "Profile incomplete"}</h2><p className="mt-2 break-all text-sm text-muted">{customer.email || "Email unavailable"}</p><p className="mt-1 text-sm text-muted">{customer.phone || "Phone not provided"}</p></div><StatusBadge tone={customer.emailConfirmedAt ? "success" : "warning"}>{customer.emailConfirmedAt ? "email confirmed" : "email unconfirmed"}</StatusBadge></div><dl className="mt-5 grid grid-cols-2 gap-4 border-t border-brand/10 pt-5 text-sm"><div><dt className="text-muted">Bookings</dt><dd className="mt-1 font-semibold text-brand-strong">{customer.bookingCount}</dd></div><div><dt className="text-muted">Joined</dt><dd className="mt-1 font-semibold text-brand-strong">{customer.accountCreatedAt ? formatBusinessDateTime(customer.accountCreatedAt) : "Unavailable"}</dd></div></dl><ButtonLink href={`/admin/customers/${customer.id}`} variant="secondary" size="sm" className="mt-6 w-full">View Customer</ButtonLink></article>)}</section>}
  </div>;
}
