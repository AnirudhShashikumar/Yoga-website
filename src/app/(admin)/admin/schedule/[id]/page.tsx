import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminDataError } from "@/components/admin/admin-data-state";
import { SessionEditorForm } from "@/components/admin/admin-forms";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { findById, getAdminClasses, getAdminSessions } from "@/features/admin/data";

export const metadata: Metadata = { title: "Edit Session" };

export default async function AdminSessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, sessions, classes] = await Promise.all([params, getAdminSessions(), getAdminClasses()]);
  if (sessions.status === "error" || classes.status === "error") return <AdminDataError />;
  const session = findById(sessions.data, id);
  if (!session) notFound();
  return <div className="space-y-8"><AdminPageHeader eyebrow="Schedule" title={session.class?.name ?? "Session"} description="Status transitions are managed from the schedule list. Session history is protected once any booking exists." /><SessionEditorForm classes={classes.data} session={session} /></div>;
}
