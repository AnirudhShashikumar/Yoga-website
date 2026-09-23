import { cn } from "@/lib/utils/cn";

type AuthFormMessageProps = {
  status: "idle" | "error" | "success";
  message?: string | undefined;
};

export function AuthFormMessage({ status, message }: AuthFormMessageProps) {
  if (!message || status === "idle") return null;

  return (
    <div
      data-auth-message
      tabIndex={-1}
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
      className={cn(
        "mb-6 rounded-2xl border px-4 py-3 text-sm leading-6",
        status === "error"
          ? "border-error/25 bg-error-soft/35 text-error"
          : "border-brand/15 bg-sage text-brand-strong",
      )}
    >
      {message}
    </div>
  );
}
