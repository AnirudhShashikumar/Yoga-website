import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type BrandIdentityProps = {
  href?: Route;
  sublabel?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  onClick?: () => void;
};

export function BrandIdentity({
  href = "/",
  sublabel = siteConfig.philosophy,
  className,
  imageClassName,
  priority = false,
  onClick,
}: BrandIdentityProps) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      {...(onClick ? { onClick } : {})}
      className={cn("group flex min-w-0 items-center gap-2.5", className)}
    >
      <Image
        src="/brand/prabha-yogashala-mark.png"
        alt=""
        width={768}
        height={768}
        priority={priority}
        sizes="48px"
        className={cn("size-11 shrink-0 object-contain sm:size-12", imageClassName)}
      />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-display text-lg font-semibold tracking-tight text-brand-strong sm:text-xl">
          {siteConfig.name}
        </span>
        <span className="truncate text-[0.68rem] font-bold uppercase tracking-[0.12em] text-brand/75">
          {sublabel}
        </span>
      </span>
    </Link>
  );
}

type BrandLockupProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLockup({ className, priority = false }: BrandLockupProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex", className)}
    >
      <Image
        src="/brand/prabha-yogashala-logo.png"
        alt={siteConfig.name}
        width={817}
        height={1094}
        priority={priority}
        sizes="(min-width: 1024px) 144px, 128px"
        className="h-auto w-32 object-contain lg:w-36"
      />
    </Link>
  );
}
