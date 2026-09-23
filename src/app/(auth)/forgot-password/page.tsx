import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/auth-forms";
import { AuthPanel } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request password-reset instructions for your Prabha Yogashala account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPanel
      eyebrow="Account Recovery"
      title="Reset your password."
      description="Enter your account email. For privacy, the response is the same whether or not an account exists."
    >
      <ForgotPasswordForm />
    </AuthPanel>
  );
}
