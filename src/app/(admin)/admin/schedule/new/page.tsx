import type { Metadata } from "next";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { SessionEditorForm } from "@/components/admin/admin-forms";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminClasses } from "@/features/admin/data";

export const metadata: Metadata = { title: "Create Session" };

export default async function AdminNewSessionPage() {
  const classes = await getAdminClasses();
  if (classes.status === "error") return <AdminDataError />;
  return <div className="space-y-8"><AdminPageHeader eyebrow="Schedule" title="Create a session" description="Use only a confirmed class, date, time, format, and capacity. Publishing makes an eligible future occurrence visible to customers." /><SessionEditorForm classes={classes.data} /></div>;
}
