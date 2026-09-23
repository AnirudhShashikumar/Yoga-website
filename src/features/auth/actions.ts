"use server";

import type { Route } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas";
import type { AuthActionState, AuthFieldErrors } from "@/features/auth/types";
import { RECOVERY_COOKIE_NAME } from "@/lib/auth/constants";
import { getPostAuthDestination } from "@/lib/auth/redirects";
import { getRoleForUser } from "@/lib/auth/session";
import { getSiteUrl } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function firstFieldErrors(error: ZodError): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) errors[field] = issue.message;
  }

  return errors;
}

function unavailableState(values?: AuthActionState["values"]): AuthActionState {
  return {
    status: "error",
    message: "Account services are temporarily unavailable. Please try again later.",
    ...(values ? { values } : {}),
  };
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const values = {
    fullName: formText(formData, "fullName"),
    email: formText(formData, "email"),
    phone: formText(formData, "phone"),
    terms: formText(formData, "terms") === "on",
  };
  const parsed = registerSchema.safeParse({
    ...values,
    password: formText(formData, "password"),
    confirmPassword: formText(formData, "confirmPassword"),
    terms: values.terms ? "on" : "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: firstFieldErrors(parsed.error),
      values,
    };
  }

  let destination: string;

  try {
    const supabase = await createSupabaseServerClient();
    const siteUrl = getSiteUrl();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
        data: {
          full_name: parsed.data.fullName,
          phone: parsed.data.phone,
        },
      },
    });

    if (error) {
      if (error.code === "weak_password") {
        return {
          status: "error",
          message: "Choose a stronger password and try again.",
          fieldErrors: { password: "This password does not meet the account policy." },
          values,
        };
      }

      return {
        status: "error",
        message: "We could not create the account. Try signing in or resetting your password.",
        values,
      };
    }

    if (data.session && data.user) {
      await supabase
        .from("profiles")
        .update({ full_name: parsed.data.fullName, phone: parsed.data.phone })
        .eq("id", data.user.id);
      const role = await getRoleForUser(supabase, data.user.id);

      if (!role) {
        await supabase.auth.signOut();
        return unavailableState(values);
      }

      destination = getPostAuthDestination(role, null);
    } else {
      destination = "/verify-email?status=sent";
    }
  } catch {
    return unavailableState(values);
  }

  redirect(destination as Route);
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const values = {
    email: formText(formData, "email"),
    next: formText(formData, "next"),
  };
  const parsed = loginSchema.safeParse({
    ...values,
    password: formText(formData, "password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: firstFieldErrors(parsed.error),
      values,
    };
  }

  let destination: string;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error || !data.user) {
      return {
        status: "error",
        message: "Email or password is incorrect, or the account is not confirmed.",
        values,
      };
    }

    const role = await getRoleForUser(supabase, data.user.id);
    if (!role) {
      await supabase.auth.signOut();
      return unavailableState(values);
    }

    destination = getPostAuthDestination(role, parsed.data.next);
  } catch {
    return unavailableState(values);
  }

  redirect(destination as Route);
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const values = { email: formText(formData, "email") };
  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter a valid email address.",
      fieldErrors: firstFieldErrors(parsed.error),
      values,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const siteUrl = getSiteUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${siteUrl}/auth/confirm?next=/reset-password`,
    });

    if (error?.code === "over_email_send_rate_limit") {
      return {
        status: "error",
        message: "Please wait before requesting another password-reset email.",
        values,
      };
    }

    if (error) return unavailableState(values);
  } catch {
    return unavailableState(values);
  }

  return {
    status: "success",
    message: "If an account exists for this email, password-reset instructions have been sent.",
    values,
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formText(formData, "password"),
    confirmPassword: formText(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: firstFieldErrors(parsed.error),
    };
  }

  const cookieStore = await cookies();
  if (!cookieStore.has(RECOVERY_COOKIE_NAME)) {
    return {
      status: "error",
      message: "This password-reset session is missing or expired. Request a new link.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

    if (claimsError || !claimsData?.claims?.sub) {
      cookieStore.set(RECOVERY_COOKIE_NAME, "", {
        maxAge: 0,
        path: "/reset-password",
      });
      return {
        status: "error",
        message: "This password-reset session is missing or expired. Request a new link.",
      };
    }

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) return unavailableState();

    await supabase.auth.signOut();
    cookieStore.set(RECOVERY_COOKIE_NAME, "", {
      maxAge: 0,
      path: "/reset-password",
    });
  } catch {
    return unavailableState();
  }

  return {
    status: "success",
    message: "Your password has been updated. You can now sign in with the new password.",
  };
}

export async function logoutAction() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // The public redirect remains safe if the auth service is unavailable.
  }

  redirect("/");
}
