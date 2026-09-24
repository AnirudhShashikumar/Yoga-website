import type { Metadata } from "next";
import Link from "next/link";

import { CustomerPageHeader } from "@/components/customer/customer-page-header";
import { CustomerDataError } from "@/components/customer/data-state";
import { ProfileForm } from "@/components/customer/profile-form";
import { Card } from "@/components/ui/card";
import { getCustomerProfile } from "@/features/customer/data";

export const metadata: Metadata = { title: "Profile" };

export default async function CustomerProfilePage() {
  const result = await getCustomerProfile();
  if (result.status === "error") return <CustomerDataError />;

  return (
    <div className="space-y-10">
      <CustomerPageHeader
        eyebrow="Profile"
        title="Preferences you control."
        description="Only the supported profile fields below can be edited. Your email remains managed by the authenticated Supabase account."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <Card>
          <h2 className="font-display text-2xl font-medium text-brand-strong">Profile details</h2>
          <ProfileForm profile={result.data} />
        </Card>

        <aside className="space-y-5">
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/65">Account email</p>
            <p className="mt-3 break-all font-semibold text-brand-strong">{result.data.email}</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Email changes are not offered here because they require the secure Supabase verification flow.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-medium text-brand-strong">Password and security</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Password changes use the established email recovery flow. Production recovery email delivery still requires SMTP verification.
            </p>
            <Link href="/forgot-password" className="mt-5 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline">
              Start secure password recovery
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
