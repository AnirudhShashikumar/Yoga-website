import type { Metadata } from "next";

import { ClassEditorForm } from "@/components/admin/admin-forms";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const metadata: Metadata = { title: "Create Class" };

export default function AdminNewClassPage() {
  return <div className="space-y-8"><AdminPageHeader eyebrow="Catalogue" title="Create a class" description="Use approved names and descriptions only. The slug becomes permanent after creation." /><ClassEditorForm /></div>;
}
