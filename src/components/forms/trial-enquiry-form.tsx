"use client";

import { useState, type FormEvent } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { classNames, practices } from "@/config/classes";
import { getWhatsAppUrl } from "@/config/site";
import { trialEnquirySchema, type TrialEnquiry } from "@/features/enquiries/schemas";

type FieldErrors = Partial<Record<keyof TrialEnquiry, string>>;

function inputProps(error: string | undefined, id: string) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

function createTrialMessage(data: TrialEnquiry) {
  return [
    "Hello Prabha Yogashala, I would like to enquire about a trial class.",
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Age: ${data.age}`,
    `Experience: ${data.experienceLevel}`,
    `Practice: ${data.interestedPractice}`,
    `Format: ${data.format}`,
    `Preferred window: ${data.preferredWindow}`,
    data.message ? `Message: ${data.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function TrialEnquiryForm({ initialPractice }: { initialPractice?: string | undefined }) {
  const initialPracticeName = practices.find((practice) => practice.slug === initialPractice)?.name;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [readyUrl, setReadyUrl] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReadyUrl(undefined);

    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const result = trialEnquirySchema.safeParse(raw);

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TrialEnquiry | undefined;
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
    setReadyUrl(getWhatsAppUrl(createTrialMessage(result.data)));
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-[2rem] border border-brand/10 bg-surface p-6 shadow-floating sm:p-8 lg:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="fullName" label="Full Name" required error={errors.fullName}>
          <Input id="fullName" name="fullName" autoComplete="name" {...inputProps(errors.fullName, "fullName")} />
        </FormField>
        <FormField id="phone" label="Phone" required error={errors.phone}>
          <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" {...inputProps(errors.phone, "phone")} />
        </FormField>
        <FormField id="email" label="Email" required error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" {...inputProps(errors.email, "email")} />
        </FormField>
        <FormField id="age" label="Age" required error={errors.age}>
          <Input id="age" name="age" type="number" inputMode="numeric" min={10} max={120} {...inputProps(errors.age, "age")} />
        </FormField>
        <FormField id="experienceLevel" label="Experience Level" required error={errors.experienceLevel}>
          <Select id="experienceLevel" name="experienceLevel" defaultValue="" {...inputProps(errors.experienceLevel, "experienceLevel")}>
            <option value="" disabled>Choose your level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </Select>
        </FormField>
        <FormField id="interestedPractice" label="Interested Practice" required error={errors.interestedPractice}>
          <Select id="interestedPractice" name="interestedPractice" defaultValue={initialPracticeName ?? ""} {...inputProps(errors.interestedPractice, "interestedPractice")}>
            <option value="" disabled>Choose a practice</option>
            {classNames.map((name) => <option key={name}>{name}</option>)}
          </Select>
        </FormField>
        <FormField id="format" label="Online / Offline" required error={errors.format}>
          <Select id="format" name="format" defaultValue="" {...inputProps(errors.format, "format")}>
            <option value="" disabled>Choose a format</option>
            <option>Online</option>
            <option>Offline</option>
          </Select>
        </FormField>
        <FormField id="preferredWindow" label="Preferred Morning / Evening" required error={errors.preferredWindow}>
          <Select id="preferredWindow" name="preferredWindow" defaultValue="" {...inputProps(errors.preferredWindow, "preferredWindow")}>
            <option value="" disabled>Choose a window</option>
            <option>Morning</option>
            <option>Evening</option>
          </Select>
        </FormField>
        <FormField id="message" label="Message" error={errors.message} className="sm:col-span-2">
          <Textarea id="message" name="message" maxLength={1000} placeholder="Share anything useful for the initial conversation." {...inputProps(errors.message, "message")} />
        </FormField>
      </div>

      <div className="mt-8 border-t border-brand/10 pt-7">
        <p className="text-sm leading-6 text-muted">
          This form validates only in your browser and does not save or send your details. After validation, you can choose to send them through WhatsApp.
        </p>
        <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">
          Prepare Trial Enquiry
        </Button>
      </div>

      {readyUrl ? (
        <div className="mt-6 rounded-2xl border border-brand/15 bg-sage p-5" role="status" aria-live="polite">
          <h2 className="font-display text-xl font-medium text-brand-strong">Your enquiry is ready.</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Nothing has been stored or sent. Continue to WhatsApp to review and send your message.
          </p>
          <a href={readyUrl} target="_blank" rel="noreferrer" className={buttonStyles({ size: "md", className: "mt-4" })}>
            Continue to WhatsApp
          </a>
        </div>
      ) : null}
    </form>
  );
}
