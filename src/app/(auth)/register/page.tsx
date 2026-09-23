import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/auth-forms";
import { AuthPanel } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a customer account with Prabha Yogashala.",
};

export default function RegisterPage() {
  return (
    <AuthPanel
      eyebrow="Customer Account"
      title="Create your account."
      description="Register for customer access. Administrative access is never available through public registration."
    >
      <RegisterForm />
    </AuthPanel>
  );
}
