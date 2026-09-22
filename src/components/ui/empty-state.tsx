import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center py-12 text-center">
      <h2 className="font-display text-2xl font-medium text-brand-strong">{title}</h2>
      <p className="mt-3 max-w-lg text-base leading-7 text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  );
}

