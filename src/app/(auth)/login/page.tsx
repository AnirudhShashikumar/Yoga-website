import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/auth-forms";
import { AuthPanel } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in securely to your Prabha Yogashala account.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const parameters = await searchParams;
  const requestedNext = Array.isArray(parameters.next) ? parameters.next[0] : parameters.next;
  const error = Array.isArray(parameters.error) ? parameters.error[0] : parameters.error;
  const notice = error === "unavailable"
    ? "Account services are temporarily unavailable. Please try again later."
    : undefined;

  return (
    <AuthPanel
      eyebrow="Welcome Back"
      title="Sign in to continue."
      description="Access your account through a secure, server-managed session."
    >
      <LoginForm next={requestedNext} notice={notice} />
    </AuthPanel>
  );
}
