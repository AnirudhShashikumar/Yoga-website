"use client";

import { useState } from "react";

import { FormField, getFieldDescriptionId } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  error?: string | undefined;
  description?: string | undefined;
};

export function PasswordField({
  id,
  name,
  label,
  autoComplete,
  error,
  description,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const describedBy = getFieldDescriptionId(id, {
    hasDescription: Boolean(description),
    hasError: Boolean(error),
  });

  return (
    <FormField id={id} label={label} required error={error} description={description}>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="pr-20"
        />
        <button
          type="button"
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-1 right-1 min-w-16 rounded-lg px-3 text-sm font-semibold text-brand hover:bg-brand-soft/40"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </FormField>
  );
}
