import { AdminActionForm } from "@/components/admin/admin-action-form";
import {
  archiveClassAction,
  archiveGalleryItemAction,
  archiveSessionAction,
  archiveWorkshopAction,
  createClassAction,
  createSessionAction,
  createWorkshopAction,
  restoreClassAction,
  updateBookingStatusAction,
  updateClassAction,
  updateCustomerProfileAction,
  updateEnquiryStatusAction,
  updateGalleryItemAction,
  updateSessionAction,
  updateSessionStatusAction,
  updateWorkshopAction,
  uploadGalleryItemAction,
} from "@/features/admin/actions";
import type {
  AdminClass,
  AdminGalleryItem,
  AdminProfile,
  AdminSession,
  AdminWorkshop,
  BookingStatus,
  EnquiryStatus,
  SessionStatus,
} from "@/features/admin/types";
import { BUSINESS_TIME_ZONE_LABEL, toBusinessDateTimeInput } from "@/lib/dates";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categoryOptions = [
  ["foundational", "Foundational"], ["dynamic", "Dynamic"], ["mind_breath", "Mind & Breath"],
  ["specialized", "Specialized"], ["personal_groups", "Personal & Groups"],
] as const;

function Check({ name, value, label, defaultChecked }: { name: string; value?: string; label: string; defaultChecked?: boolean | undefined }) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-xl border border-brand/10 bg-surface-subtle px-4 text-sm font-semibold text-brand-strong">
      <input type="checkbox" name={name} value={value} defaultChecked={defaultChecked} className="size-4 accent-brand" />
      {label}
    </label>
  );
}

export function ClassEditorForm({ classItem }: { classItem?: AdminClass }) {
  const editing = Boolean(classItem);
  return (
    <AdminActionForm action={editing ? updateClassAction : createClassAction} submitLabel={editing ? "Save Class" : "Create Class"} successLabel="Saved" className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8">
      {classItem ? <input type="hidden" name="id" value={classItem.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="name" label="Class name" required><Input id="name" name="name" required maxLength={120} defaultValue={classItem?.name} /></FormField>
        <FormField id="slug" label="Public URL slug" required description={editing ? "Slugs are immutable after creation to protect existing links." : "Lowercase words separated by hyphens."}>
          <Input id="slug" name="slug" required={!editing} disabled={editing} pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={classItem?.slug} />
        </FormField>
        <FormField id="category" label="Category" required><Select id="category" name="category" defaultValue={classItem?.category ?? "foundational"}>{categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></FormField>
        <FormField id="sortOrder" label="Sort order"><Input id="sortOrder" name="sortOrder" type="number" min={0} max={100000} defaultValue={classItem?.sort_order ?? 0} /></FormField>
        <FormField id="shortDescription" label="Short description" required className="sm:col-span-2"><Textarea id="shortDescription" name="shortDescription" required maxLength={300} rows={3} defaultValue={classItem?.short_description} /></FormField>
        <FormField id="description" label="Full description" required className="sm:col-span-2"><Textarea id="description" name="description" required maxLength={5000} rows={7} defaultValue={classItem?.description} /></FormField>
      </div>
      <fieldset><legend className="text-sm font-semibold text-brand-strong">Supported levels</legend><div className="mt-2 grid gap-2 sm:grid-cols-3">{(["beginner", "intermediate", "advanced"] as const).map((level) => <Check key={level} name="levels" value={level} label={level.charAt(0).toUpperCase() + level.slice(1)} defaultChecked={classItem?.levels.includes(level)} />)}</div></fieldset>
      <fieldset><legend className="text-sm font-semibold text-brand-strong">Available formats</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{(["online", "offline"] as const).map((format) => <Check key={format} name="formats" value={format} label={format.charAt(0).toUpperCase() + format.slice(1)} defaultChecked={classItem?.available_formats.includes(format)} />)}</div></fieldset>
      <div className="grid gap-2 sm:grid-cols-2"><Check name="featured" label="Featured class" defaultChecked={classItem?.featured} /><Check name="published" label="Visible in the public catalogue" defaultChecked={classItem?.published} /></div>
    </AdminActionForm>
  );
}

export function ClassArchiveForm({ classItem }: { classItem: AdminClass }) {
  if (classItem.archived_at) {
    return <AdminActionForm action={restoreClassAction} submitLabel="Restore as Draft" variant="secondary"><input type="hidden" name="id" value={classItem.id} /></AdminActionForm>;
  }
  return (
    <AdminActionForm action={archiveClassAction} submitLabel="Archive Class" variant="danger" confirm={{ title: "Archive this class?", description: "It will be removed from public catalogues. Historical records remain. Future published sessions must be resolved first." }}>
      <input type="hidden" name="id" value={classItem.id} />
    </AdminActionForm>
  );
}

export function SessionEditorForm({ classes, session }: { classes: AdminClass[]; session?: AdminSession }) {
  const dateTime = session ? toBusinessDateTimeInput(session.starts_at) : null;
  const endDateTime = session ? toBusinessDateTimeInput(session.ends_at) : null;
  const locked = Boolean(session && session.totalBookingCount > 0);
  return (
    <AdminActionForm action={session ? updateSessionAction : createSessionAction} submitLabel={session ? "Save Session" : "Create Session"} successLabel="Saved" className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8">
      {session ? <input type="hidden" name="id" value={session.id} /> : null}
      {locked ? <p className="rounded-xl bg-sky/50 p-4 text-sm leading-6 text-muted">This session has booking history. Its class, timing, and format are locked; capacity can never be lower than active bookings.</p> : null}
      <p className="text-sm leading-6 text-muted">Times are entered and displayed in {BUSINESS_TIME_ZONE_LABEL}; the database stores UTC instants.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="classId" label="Class" required className="sm:col-span-2"><Select id="classId" name="classId" required defaultValue={session?.class_id ?? ""} disabled={locked}><option value="" disabled>Choose a class</option>{classes.filter((item) => !item.archived_at).map((item) => <option key={item.id} value={item.id}>{item.name}{item.published ? "" : " — unpublished"}</option>)}</Select>{locked ? <input type="hidden" name="classId" value={session?.class_id} /> : null}</FormField>
        <FormField id="date" label="Date" required><Input id="date" name="date" type="date" required defaultValue={dateTime?.date} disabled={locked} />{locked ? <input type="hidden" name="date" value={dateTime?.date} /> : null}</FormField>
        <FormField id="format" label="Format" required><Select id="format" name="format" defaultValue={session?.format ?? "online"} disabled={locked}><option value="online">Online</option><option value="offline">Offline</option></Select>{locked ? <input type="hidden" name="format" value={session?.format} /> : null}</FormField>
        <FormField id="startTime" label="Start time" required><Input id="startTime" name="startTime" type="time" required defaultValue={dateTime?.time} disabled={locked} />{locked ? <input type="hidden" name="startTime" value={dateTime?.time} /> : null}</FormField>
        <FormField id="endTime" label="End time" required><Input id="endTime" name="endTime" type="time" required defaultValue={endDateTime?.time} disabled={locked} />{locked ? <input type="hidden" name="endTime" value={endDateTime?.time} /> : null}</FormField>
        <FormField id="capacity" label="Capacity" description="Optional. Never interpreted as remaining spots."><Input id="capacity" name="capacity" type="number" min={1} max={10000} defaultValue={session?.capacity ?? ""} /></FormField>
      </div>
      {!session ? <Check name="publish" label="Publish immediately" /> : null}
    </AdminActionForm>
  );
}

export function BookingStatusForm({ id, current, target }: { id: string; current: BookingStatus; target: Exclude<BookingStatus, "pending"> }) {
  const destructive = target === "cancelled";
  return (
    <AdminActionForm action={updateBookingStatusAction} submitLabel={target === "confirmed" ? "Confirm" : target === "completed" ? "Complete" : "Cancel"} variant={destructive ? "danger" : "secondary"} className="inline-block" confirm={destructive ? { title: "Cancel this booking?", description: `This changes the booking from ${current} to cancelled and keeps it in history.` } : undefined}>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={target} />
    </AdminActionForm>
  );
}

export function SessionStatusForm({ session, target }: { session: AdminSession; target: Exclude<SessionStatus, "draft"> }) {
  const destructive = target === "cancelled";
  return (
    <AdminActionForm action={updateSessionStatusAction} submitLabel={target === "published" ? "Publish" : target === "completed" ? "Complete" : "Cancel"} variant={destructive ? "danger" : "secondary"} className="inline-block" confirm={destructive ? { title: "Cancel this session?", description: "Customers with bookings will see the cancelled session status. Booking records are retained." } : undefined}>
      <input type="hidden" name="id" value={session.id} /><input type="hidden" name="status" value={target} />
    </AdminActionForm>
  );
}

export function SessionArchiveForm({ session }: { session: AdminSession }) {
  return <AdminActionForm action={archiveSessionAction} submitLabel="Archive" variant="danger" confirm={{ title: "Archive this session?", description: "Only non-published sessions without active bookings can be archived. Historical records remain." }}><input type="hidden" name="id" value={session.id} /></AdminActionForm>;
}

export function EnquiryStatusForm({ id, current, target }: { id: string; current: EnquiryStatus; target: Exclude<EnquiryStatus, "new"> }) {
  return <AdminActionForm action={updateEnquiryStatusAction} submitLabel={`Mark ${target}`} variant={target === "closed" ? "danger" : "secondary"} confirm={target === "closed" ? { title: "Close this enquiry?", description: `This changes the enquiry from ${current} to closed; its consent and contact history remain retained.` } : undefined}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={target} /></AdminActionForm>;
}

export function CustomerProfileForm({ customer }: { customer: AdminProfile }) {
  return (
    <AdminActionForm action={updateCustomerProfileAction} submitLabel="Save Profile" successLabel="Saved" className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8">
      <input type="hidden" name="id" value={customer.id} />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="fullName" label="Full name"><Input id="fullName" name="fullName" maxLength={120} defaultValue={customer.full_name ?? ""} /></FormField>
        <FormField id="phone" label="Phone"><Input id="phone" name="phone" type="tel" maxLength={30} defaultValue={customer.phone ?? ""} /></FormField>
        <FormField id="age" label="Age"><Input id="age" name="age" type="number" min={10} max={120} defaultValue={customer.age ?? ""} /></FormField>
        <FormField id="experienceLevel" label="Experience level"><Select id="experienceLevel" name="experienceLevel" defaultValue={customer.experience_level ?? ""}><option value="">Not provided</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></Select></FormField>
        <FormField id="preferredFormat" label="Preferred format"><Select id="preferredFormat" name="preferredFormat" defaultValue={customer.preferred_format ?? ""}><option value="">Not provided</option><option value="online">Online</option><option value="offline">Offline</option></Select></FormField>
      </div>
      <p className="text-sm leading-6 text-muted">Email and role are intentionally not editable here. Authentication and protected authorization stay outside profile management.</p>
    </AdminActionForm>
  );
}

export function WorkshopEditorForm({ workshop }: { workshop?: AdminWorkshop }) {
  const start = workshop?.starts_at ? toBusinessDateTimeInput(workshop.starts_at) : null;
  const end = workshop?.ends_at ? toBusinessDateTimeInput(workshop.ends_at) : null;
  return (
    <AdminActionForm action={workshop ? updateWorkshopAction : createWorkshopAction} submitLabel={workshop ? "Save Workshop" : "Create Workshop"} successLabel="Saved" className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8">
      {workshop ? <input type="hidden" name="id" value={workshop.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="title" label="Title" required><Input id="title" name="title" required maxLength={160} defaultValue={workshop?.title} /></FormField>
        <FormField id="slug" label="Public URL slug" required description={workshop ? "Immutable in the V1 editor." : "Lowercase words separated by hyphens."}><Input id="slug" name="slug" required={!workshop} disabled={Boolean(workshop)} defaultValue={workshop?.slug} /></FormField>
        <FormField id="summary" label="Summary" required className="sm:col-span-2"><Textarea id="summary" name="summary" required maxLength={400} rows={3} defaultValue={workshop?.summary} /></FormField>
        <FormField id="description" label="Description" required className="sm:col-span-2"><Textarea id="description" name="description" required maxLength={8000} rows={7} defaultValue={workshop?.description} /></FormField>
        <FormField id="date" label="Date"><Input id="date" name="date" type="date" defaultValue={start?.date} /></FormField>
        <FormField id="format" label="Format"><Select id="format" name="format" defaultValue={workshop?.format ?? ""}><option value="">Not set</option><option value="online">Online</option><option value="offline">Offline</option></Select></FormField>
        <FormField id="startTime" label="Start time"><Input id="startTime" name="startTime" type="time" defaultValue={start?.time} /></FormField>
        <FormField id="endTime" label="End time"><Input id="endTime" name="endTime" type="time" defaultValue={end?.time} /></FormField>
      </div>
      <Check name="published" label="Publish on the public workshops page" defaultChecked={workshop?.published} />
    </AdminActionForm>
  );
}

export function WorkshopArchiveForm({ workshop }: { workshop: AdminWorkshop }) {
  return <AdminActionForm action={archiveWorkshopAction} submitLabel="Archive Workshop" variant="danger" confirm={{ title: "Archive this workshop?", description: "It will no longer appear publicly; the record is retained." }}><input type="hidden" name="id" value={workshop.id} /></AdminActionForm>;
}

export function GalleryUploadForm() {
  return (
    <AdminActionForm action={uploadGalleryItemAction} submitLabel="Upload Image" pendingLabel="Uploading…" successLabel="Uploaded" className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="file" label="Image" required description="JPEG, PNG, WebP, or AVIF; maximum 8 MB."><Input id="file" name="file" type="file" required accept="image/jpeg,image/png,image/webp,image/avif" className="py-3" /></FormField>
        <FormField id="sortOrder" label="Sort order"><Input id="sortOrder" name="sortOrder" type="number" min={0} max={100000} defaultValue={0} /></FormField>
        <FormField id="altText" label="Meaningful alt text" required className="sm:col-span-2"><Input id="altText" name="altText" required maxLength={500} /></FormField>
        <FormField id="caption" label="Caption" className="sm:col-span-2"><Textarea id="caption" name="caption" maxLength={1000} rows={3} /></FormField>
      </div>
      <Check name="published" label="Publish immediately" />
    </AdminActionForm>
  );
}

export function GalleryEditorForm({ item }: { item: AdminGalleryItem }) {
  return (
    <AdminActionForm action={updateGalleryItemAction} submitLabel="Save Gallery Item" successLabel="Saved" className="rounded-2xl border border-brand/10 bg-surface p-6 shadow-card sm:p-8">
      <input type="hidden" name="id" value={item.id} />
      <FormField id="altText" label="Meaningful alt text" required><Input id="altText" name="altText" required maxLength={500} defaultValue={item.alt_text} /></FormField>
      <FormField id="caption" label="Caption"><Textarea id="caption" name="caption" maxLength={1000} rows={3} defaultValue={item.caption ?? ""} /></FormField>
      <FormField id="sortOrder" label="Sort order"><Input id="sortOrder" name="sortOrder" type="number" min={0} max={100000} defaultValue={item.sort_order} /></FormField>
      <Check name="published" label="Published" defaultChecked={item.published} />
    </AdminActionForm>
  );
}

export function GalleryArchiveForm({ item }: { item: AdminGalleryItem }) {
  return <AdminActionForm action={archiveGalleryItemAction} submitLabel="Archive Item" variant="danger" confirm={{ title: "Archive this gallery item?", description: "It will no longer appear publicly. The media file remains retained for recovery." }}><input type="hidden" name="id" value={item.id} /></AdminActionForm>;
}
