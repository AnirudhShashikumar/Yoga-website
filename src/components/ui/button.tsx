import type { Route } from "next";
import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string | undefined;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-action hover:bg-brand-strong disabled:bg-surface-muted disabled:text-muted",
  secondary:
    "border border-brand/20 bg-background text-brand hover:bg-surface-subtle",
  ghost: "bg-transparent text-brand hover:bg-brand-soft/50",
  danger: "bg-error text-white hover:bg-red-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-6 text-sm",
  lg: "min-h-[3.25rem] px-8 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-pill font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  className,
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

export type ButtonLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "className" | "href"
> & {
  href: Route | `/${string}` | `https://${string}`;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string | undefined;
};

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href as Route}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
