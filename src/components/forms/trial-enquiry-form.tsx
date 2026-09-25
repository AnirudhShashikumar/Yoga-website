"use client";

import { useActionState, useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { initialTrialEnquiryState, submitTrialEnquiryAction } from "@/features/enquiries/actions";

type ClassOption = { id: string; slug: string; name: string };

export function TrialEnquiryForm({ initialPractice, classes }: { initialPractice?: string | undefined; classes: ClassOption[] }) {
  const initial = classes.find((item) => item.slug === initialPractice) ?? classes[0];
  const [selectedId, setSelectedId] = useState(initial?.id ?? "");
  const [state, action, pending] = useActionState(submitTrialEnquiryAction, initialTrialEnquiryState);
  const selected = classes.find((item) => item.id === selectedId);
  const error = (name: string) => state.fieldErrors?.[name];

  return <form action={action} noValidate className="rounded-[2rem] border border-brand/10 bg-surface p-6 shadow-floating sm:p-8 lg:p-10">
    <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true"><label htmlFor="website">Leave this blank</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <input type="hidden" name="interestedPractice" value={selected?.name ?? ""} />
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField id="fullName" label="Full Name" required error={error("fullName")}><Input id="fullName" name="fullName" autoComplete="name" required aria-invalid={Boolean(error("fullName"))} /></FormField>
      <FormField id="phone" label="Phone" required error={error("phone")}><Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={Boolean(error("phone"))} /></FormField>
      <FormField id="email" label="Email" required error={error("email")}><Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(error("email"))} /></FormField>
      <FormField id="age" label="Age" required error={error("age")}><Input id="age" name="age" type="number" inputMode="numeric" min={10} max={120} required aria-invalid={Boolean(error("age"))} /></FormField>
      <FormField id="experienceLevel" label="Experience Level" required error={error("experienceLevel")}><Select id="experienceLevel" name="experienceLevel" defaultValue="" required aria-invalid={Boolean(error("experienceLevel"))}><option value="" disabled>Choose your level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></Select></FormField>
      <FormField id="interestedClassId" label="Interested Practice" required error={error("interestedClassId")}><Select id="interestedClassId" name="interestedClassId" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} required aria-invalid={Boolean(error("interestedClassId"))}><option value="" disabled>Choose a practice</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></FormField>
      <FormField id="format" label="Online / Offline" required error={error("format")}><Select id="format" name="format" defaultValue="" required aria-invalid={Boolean(error("format"))}><option value="" disabled>Choose a format</option><option>Online</option><option>Offline</option></Select></FormField>
      <FormField id="preferredWindow" label="Preferred Morning / Evening" required error={error("preferredWindow")}><Select id="preferredWindow" name="preferredWindow" defaultValue="" required aria-invalid={Boolean(error("preferredWindow"))}><option value="" disabled>Choose a window</option><option>Morning</option><option>Evening</option></Select></FormField>
      <FormField id="message" label="Message" error={error("message")} className="sm:col-span-2"><Textarea id="message" name="message" maxLength={1000} placeholder="Share anything useful for the initial conversation." aria-invalid={Boolean(error("message"))} /></FormField>
      <div className="sm:col-span-2"><label className="flex items-start gap-3 rounded-xl border border-brand/10 bg-surface-subtle p-4 text-sm leading-6 text-muted"><input type="checkbox" name="consent" className="mt-1 size-4 shrink-0 accent-brand" required /><span>I consent to Prabha Yogashala storing these details and contacting me about this enquiry.</span></label>{error("consent") ? <p role="alert" className="mt-2 text-sm font-medium text-error">{error("consent")}</p> : null}</div>
    </div>
    <div className="mt-8 border-t border-brand/10 pt-7"><p className="text-sm leading-6 text-muted">Submitting saves this enquiry securely so the team can follow up. It does not confirm a class, time, format, price, or booking.</p><Button type="submit" size="lg" className="mt-5 w-full sm:w-auto" disabled={pending || state.status === "success"}>{pending ? "Submitting…" : state.status === "success" ? "Enquiry Submitted" : "Submit Trial Enquiry"}</Button></div>
    {state.message ? <div role={state.status === "error" ? "alert" : "status"} aria-live="polite" className={`mt-6 rounded-2xl border p-5 ${state.status === "error" ? "border-error/20 bg-error-soft/30 text-error" : "border-brand/15 bg-sage text-brand-strong"}`}><p className="font-semibold">{state.message}</p>{state.whatsappUrl ? <><p className="mt-2 text-sm leading-6 text-muted">Optionally continue to WhatsApp to share the same details directly.</p><a href={state.whatsappUrl} target="_blank" rel="noreferrer" className={buttonStyles({ size: "md", className: "mt-4" })}>Continue to WhatsApp</a></> : null}</div> : null}
  </form>;
}
