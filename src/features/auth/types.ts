export type AuthFieldErrors = Record<string, string | undefined>;

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string | undefined;
  fieldErrors?: AuthFieldErrors | undefined;
  values?: {
    fullName?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    next?: string | undefined;
    terms?: boolean | undefined;
  } | undefined;
};

export const initialAuthActionState: AuthActionState = { status: "idle" };
