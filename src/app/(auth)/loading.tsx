import { Skeleton } from "@/components/ui/skeleton";

export default function AuthenticationLoading() {
  return (
    <div className="w-full max-w-xl rounded-[2rem] border border-brand/10 bg-surface p-6 shadow-floating sm:p-9" aria-label="Loading account page">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-5 h-10 w-4/5" />
      <Skeleton className="mt-4 h-6 w-full" />
      <Skeleton className="mt-8 h-14 w-full" />
      <Skeleton className="mt-5 h-14 w-full" />
      <Skeleton className="mt-6 h-12 w-full rounded-pill" />
    </div>
  );
}
