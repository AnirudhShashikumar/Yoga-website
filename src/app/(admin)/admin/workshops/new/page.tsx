import type { Metadata } from "next";
import { WorkshopEditorForm } from "@/components/admin/admin-forms";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
export const metadata: Metadata = { title: "Create Workshop" };
export default function AdminNewWorkshopPage() { return <div className="space-y-8"><AdminPageHeader eyebrow="Workshops" title="Create a workshop" description="Keep this as a draft until its topic, timing, format, and wording are approved." /><WorkshopEditorForm /></div>; }
