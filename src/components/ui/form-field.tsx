import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type FormFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  description?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  className?: string | undefined;
};

export function FormField({
  id,
  label,
  children,
  description,
  error,
  required,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-brand-strong">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {description && !error ? (
        <p id={`${id}-description`} className="text-sm text-muted">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function getFieldDescriptionId(
  id: string,
  options: { hasDescription?: boolean; hasError?: boolean },
) {
  if (options.hasError) return `${id}-error`;
  if (options.hasDescription) return `${id}-description`;
  return undefined;
}
