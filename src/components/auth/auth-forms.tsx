"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";

import { AuthFormMessage } from "@/components/auth/auth-form-message";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resetPasswordAction,
} from "@/features/auth/actions";
import { initialAuthActionState, type AuthActionState } from "@/features/auth/types";

function fieldProps(id: string, error: string | undefined) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

function useAuthFormFocus(state: AuthActionState) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== "error") return;
    const form = formRef.current;
    const invalidField = form?.querySelector<HTMLElement>("[aria-invalid='true']");
    const message = form?.querySelector<HTMLElement>("[data-auth-message]");
    (invalidField ?? message)?.focus();
  }, [state]);

  return formRef;
}

export function LoginForm({
  next,
  notice,
}: {
  next?: string | undefined;
  notice?: string | undefined;
}) {
  const [state, action, pending] = useActionState(loginAction, {
    ...initialAuthActionState,
    ...(notice ? { status: "error" as const, message: notice } : {}),
    values: { next },
  });
  const formRef = useAuthFormFocus(state);

  return (
    <form ref={formRef} action={action} noValidate>
      <AuthFormMessage status={state.status} message={state.message} />
      <input type="hidden" name="next" value={state.values?.next ?? next ?? ""} />
      <div className="space-y-5">
        <FormField id="loginEmail" label="Email" required error={state.fieldErrors?.email}>
          <Input
            id="loginEmail"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            defaultValue={state.values?.email}
            {...fieldProps("loginEmail", state.fieldErrors?.email)}
          />
        </FormField>
        <PasswordField
          id="loginPassword"
          name="password"
          label="Password"
          autoComplete="current-password"
          error={state.fieldErrors?.password}
        />
      </div>
      <div className="mt-3 text-right">
        <Link href="/forgot-password" className="text-sm font-semibold text-brand underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </Button>
      <p className="mt-6 text-center text-sm text-muted">
        New to Prabha Yogashala?{" "}
        <Link href="/register" className="font-semibold text-brand underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialAuthActionState);
  const formRef = useAuthFormFocus(state);

  return (
    <form ref={formRef} action={action} noValidate>
      <AuthFormMessage status={state.status} message={state.message} />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="registerName" label="Full Name" required error={state.fieldErrors?.fullName} className="sm:col-span-2">
          <Input id="registerName" name="fullName" autoComplete="name" defaultValue={state.values?.fullName} {...fieldProps("registerName", state.fieldErrors?.fullName)} />
        </FormField>
        <FormField id="registerEmail" label="Email" required error={state.fieldErrors?.email}>
          <Input id="registerEmail" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={state.values?.email} {...fieldProps("registerEmail", state.fieldErrors?.email)} />
        </FormField>
        <FormField id="registerPhone" label="Phone" required error={state.fieldErrors?.phone}>
          <Input id="registerPhone" name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={state.values?.phone} {...fieldProps("registerPhone", state.fieldErrors?.phone)} />
        </FormField>
        <PasswordField id="registerPassword" name="password" label="Password" autoComplete="new-password" error={state.fieldErrors?.password} description="Use 8–72 characters with at least one letter and one number." />
        <PasswordField id="registerConfirmPassword" name="confirmPassword" label="Confirm Password" autoComplete="new-password" error={state.fieldErrors?.confirmPassword} />
      </div>
      <div className="mt-6">
        <label className="flex items-start gap-3 text-sm leading-6 text-muted">
          <input
            type="checkbox"
            name="terms"
            defaultChecked={state.values?.terms}
            className="mt-1 size-5 shrink-0 accent-brand"
            aria-invalid={Boolean(state.fieldErrors?.terms)}
            aria-describedby={state.fieldErrors?.terms ? "registerTerms-error" : undefined}
          />
          <span>
            I acknowledge the{" "}
            <Link href="/terms" className="font-semibold text-brand underline-offset-4 hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="font-semibold text-brand underline-offset-4 hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        {state.fieldErrors?.terms ? (
          <p id="registerTerms-error" role="alert" className="mt-2 text-sm font-medium text-error">
            {state.fieldErrors.terms}
          </p>
        ) : null}
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create Account"}
      </Button>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initialAuthActionState);
  const formRef = useAuthFormFocus(state);

  return (
    <form ref={formRef} action={action} noValidate>
      <AuthFormMessage status={state.status} message={state.message} />
      <FormField id="forgotEmail" label="Email" required error={state.fieldErrors?.email}>
        <Input id="forgotEmail" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={state.values?.email} {...fieldProps("forgotEmail", state.fieldErrors?.email)} />
      </FormField>
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending || state.status === "success"}>
        {pending ? "Sending instructions…" : "Send Reset Instructions"}
      </Button>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="font-semibold text-brand underline-offset-4 hover:underline">Back to Sign In</Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, initialAuthActionState);
  const formRef = useAuthFormFocus(state);

  if (state.status === "success") {
    return (
      <div>
        <AuthFormMessage status={state.status} message={state.message} />
        <Link href="/login" className="inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-brand px-6 text-sm font-semibold text-white shadow-action hover:bg-brand-strong">
          Continue to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate>
      <AuthFormMessage status={state.status} message={state.message} />
      <div className="space-y-5">
        <PasswordField id="resetPassword" name="password" label="New Password" autoComplete="new-password" error={state.fieldErrors?.password} description="Use 8–72 characters with at least one letter and one number." />
        <PasswordField id="resetConfirmPassword" name="confirmPassword" label="Confirm New Password" autoComplete="new-password" error={state.fieldErrors?.confirmPassword} />
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
        {pending ? "Updating password…" : "Update Password"}
      </Button>
    </form>
  );
}
