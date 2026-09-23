"use client";

import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

type AccountState = { href: "/login" | "/dashboard" | "/admin"; label: string };

const signedOutState: AccountState = { href: "/login", label: "Sign In" };

export function AccountLink({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const [account, setAccount] = useState<AccountState>(signedOutState);

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof createSupabaseBrowserClient>;

    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      return;
    }

    async function refreshAccount() {
      const { data, error } = await supabase.auth.getClaims();
      const userId = data?.claims?.sub;

      if (error || typeof userId !== "string") {
        if (active) setAccount(signedOutState);
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (!active) return;
      setAccount(
        roleData?.role === "admin"
          ? { href: "/admin", label: "Admin" }
          : { href: "/dashboard", label: "My Account" },
      );
    }

    void refreshAccount();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void refreshAccount(), 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <ButtonLink
      href={account.href}
      variant="secondary"
      size={mobile ? "lg" : "sm"}
      className={cn(mobile && "w-full")}
      {...(onNavigate ? { onClick: onNavigate } : {})}
    >
      {account.label}
    </ButtonLink>
  );
}
