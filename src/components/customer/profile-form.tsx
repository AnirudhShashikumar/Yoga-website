"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { CustomerActionMessage } from "@/components/customer/action-message";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { updateProfileAction } from "@/features/customer/actions";
import type { CustomerActionState, CustomerProfile } from "@/features/customer/types";
import { initialCustomerActionState } from "@/features/customer/types";

function fieldA11y(id: string, error: string | undefined) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

export function ProfileForm({ profile }: { profile: CustomerProfile }) {
  const [state, setState] = useState<CustomerActionState>(initialCustomerActionState);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (state.status !== "error") return;
    formRef.current
      ?.querySelector<HTMLElement>("[aria-invalid='true'], [role='alert']")
      ?.focus();
  }, [state]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const value = (name: string, fallback: string) => state.values?.[name] ?? fallback;

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          const nextState = await updateProfileAction(state, formData);
          setState(nextState);
          if (nextState.status === "success") setDirty(false);
        });
      }}
      noValidate
      onChange={() => {
        setDirty(true);
        if (state.status === "success") setState(initialCustomerActionState);
      }}
    >
      <CustomerActionMessage state={state} />
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <FormField
          id="profileFullName"
          label="Full name"
          error={state.fieldErrors?.fullName}
          className="sm:col-span-2"
        >
          <Input
            id="profileFullName"
            name="fullName"
            autoComplete="name"
            defaultValue={value("fullName", profile.fullName ?? "")}
            {...fieldA11y("profileFullName", state.fieldErrors?.fullName)}
          />
        </FormField>

        <FormField id="profilePhone" label="Phone" error={state.fieldErrors?.phone}>
          <Input
            id="profilePhone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={value("phone", profile.phone ?? "")}
            {...fieldA11y("profilePhone", state.fieldErrors?.phone)}
          />
        </FormField>

        <FormField id="profileAge" label="Age" error={state.fieldErrors?.age}>
          <Input
            id="profileAge"
            name="age"
            type="number"
            inputMode="numeric"
            min={10}
            max={120}
            defaultValue={value("age", profile.age?.toString() ?? "")}
            {...fieldA11y("profileAge", state.fieldErrors?.age)}
          />
        </FormField>

        <FormField
          id="profileExperience"
          label="Experience level"
          error={state.fieldErrors?.experienceLevel}
        >
          <Select
            id="profileExperience"
            name="experienceLevel"
            defaultValue={value("experienceLevel", profile.experienceLevel ?? "")}
            {...fieldA11y("profileExperience", state.fieldErrors?.experienceLevel)}
          >
            <option value="">Not specified</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </FormField>

        <FormField
          id="profileFormat"
          label="Preferred format"
          error={state.fieldErrors?.preferredFormat}
        >
          <Select
            id="profileFormat"
            name="preferredFormat"
            defaultValue={value("preferredFormat", profile.preferredFormat ?? "")}
            {...fieldA11y("profileFormat", state.fieldErrors?.preferredFormat)}
          >
            <option value="">Not specified</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </Select>
        </FormField>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" className="w-full sm:w-auto" disabled={pending || !dirty}>
          {pending ? "Saving…" : "Save Profile"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full sm:w-auto"
          disabled={pending || !dirty}
          onClick={() => {
            formRef.current?.reset();
            setDirty(false);
            setState(initialCustomerActionState);
          }}
        >
          Discard Changes
        </Button>
        {dirty ? <span role="status" className="text-sm font-medium text-muted">Unsaved changes</span> : null}
      </div>
    </form>
  );
}
