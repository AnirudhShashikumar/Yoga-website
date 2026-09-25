import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomerProfileForm } from "@/components/admin/admin-forms";
import { AdminDataError } from "@/components/admin/admin-data-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatus } from "@/components/admin/admin-status";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { findById, getAdminBookings, getAdminCustomers } from "@/features/admin/data";
import { formatBusinessDateTime } from "@/lib/dates";

export const metadata: Metadata = { title: "Customer Details" };

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, customers, bookings] = await Promise.all([params, getAdminCustomers(), getAdminBookings()]);
  if (customers.status === "error" || bookings.status === "error") return <AdminDataError />;
  const customer = findById(customers.data, id);
  if (!customer) notFound();
  const history = bookings.data.filter((booking) => booking.customer_id === id);
  return <div className="space-y-10">
    <AdminPageHeader eyebrow="Customer" title={customer.full_name || "Profile incomplete"} description="Only supported profile fields can be edited. Authentication email is read-only and role controls are never exposed." />
    <Card><dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-sm text-muted">Account email</dt><dd className="mt-1 break-all font-semibold text-brand-strong">{customer.email || "Unavailable"}</dd></div><div><dt className="text-sm text-muted">Email confirmation</dt><dd className="mt-1 font-semibold text-brand-strong">{customer.emailConfirmedAt ? formatBusinessDateTime(customer.emailConfirmedAt) : "Not confirmed"}</dd></div><div><dt className="text-sm text-muted">Last sign-in</dt><dd className="mt-1 font-semibold text-brand-strong">{customer.lastSignInAt ? formatBusinessDateTime(customer.lastSignInAt) : "No recorded sign-in"}</dd></div><div><dt className="text-sm text-muted">Customer role</dt><dd className="mt-1 font-semibold text-brand-strong">Protected · read only</dd></div></dl></Card>
    <section><h2 className="mb-5 font-display text-2xl font-medium text-brand-strong">Profile</h2><CustomerProfileForm customer={customer} /></section>
    <section><h2 className="mb-5 font-display text-2xl font-medium text-brand-strong">Booking history</h2>{history.length ? <div className="space-y-3">{history.map((booking) => <Card key={booking.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-brand-strong">{booking.session?.class?.name ?? "Session details unavailable"}</p><p className="mt-1 text-sm text-muted">{booking.session ? formatBusinessDateTime(booking.session.starts_at) : "Date unavailable"}</p></div><AdminStatus status={booking.status} /></div></Card>)}</div> : <EmptyState title="No bookings for this customer." description="A booking will appear here only after this account books a real published session." />}</section>
  </div>;
}
