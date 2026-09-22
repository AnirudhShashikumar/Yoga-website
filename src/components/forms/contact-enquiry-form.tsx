"use client";

import { useState, type FormEvent } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getWhatsAppUrl } from "@/config/site";
import { contactEnquirySchema, type ContactEnquiry } from "@/features/enquiries/schemas";

type FieldErrors = Partial<Record<keyof ContactEnquiry, string>>;

function propsFor(error: string | undefined, id: string) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

export function ContactEnquiryForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [readyUrl, setReadyUrl] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReadyUrl(undefined);
    const form = event.currentTarget;
    const result = contactEnquirySchema.safeParse(Object.fromEntries(new FormData(form)));

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactEnquiry | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      const firstInvalidName = Object.keys(nextErrors)[0];
      const firstInvalidField = firstInvalidName
        ? form.elements.namedItem(firstInvalidName)
        : null;
      if (firstInvalidField instanceof HTMLElement) firstInvalidField.focus();
      return;
    }

    setErrors({});
    const data = result.data;
    const message = [
      "Hello Prabha Yogashala, I have a website enquiry.",
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : "",
      `Topic: ${data.topic}`,
      `Message: ${data.message}`,
    ].filter(Boolean).join("\n");
    setReadyUrl(getWhatsAppUrl(message));
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-[2rem] border border-brand/10 bg-surface p-6 shadow-floating sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="contactFullName" label="Full Name" required error={errors.fullName}>
          <Input id="contactFullName" name="fullName" autoComplete="name" {...propsFor(errors.fullName, "contactFullName")} />
        </FormField>
        <FormField id="contactEmail" label="Email" required error={errors.email}>
          <Input id="contactEmail" name="email" type="email" autoComplete="email" {...propsFor(errors.email, "contactEmail")} />
        </FormField>
        <FormField id="contactPhone" label="Phone (optional)" error={errors.phone}>
          <Input id="contactPhone" name="phone" type="tel" autoComplete="tel" {...propsFor(errors.phone, "contactPhone")} />
        </FormField>
        <FormField id="contactTopic" label="Topic" required error={errors.topic}>
          <Select id="contactTopic" name="topic" defaultValue="" {...propsFor(errors.topic, "contactTopic")}>
            <option value="" disabled>Choose a topic</option>
            <option>Trial class</option>
            <option>Classes</option>
            <option>Schedule</option>
            <option>Pricing</option>
            <option>Workshop</option>
            <option>Other</option>
          </Select>
        </FormField>
        <FormField id="contactMessage" label="Message" required error={errors.message} className="sm:col-span-2">
          <Textarea id="contactMessage" name="message" maxLength={1000} {...propsFor(errors.message, "contactMessage")} />
        </FormField>
      </div>
      <p className="mt-7 text-sm leading-6 text-muted">
        This frontend preview does not save or send form data. Validation prepares a WhatsApp message that you choose whether to send.
      </p>
      <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">Prepare Enquiry</Button>
      {readyUrl ? (
        <div className="mt-6 rounded-2xl border border-brand/15 bg-sage p-5" role="status" aria-live="polite">
          <h2 className="font-display text-xl font-medium text-brand-strong">Your message is ready.</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Nothing has been stored or sent. Review it in WhatsApp before sending.</p>
          <a href={readyUrl} target="_blank" rel="noreferrer" className={buttonStyles({ className: "mt-4" })}>Continue to WhatsApp</a>
        </div>
      ) : null}
    </form>
  );
}
