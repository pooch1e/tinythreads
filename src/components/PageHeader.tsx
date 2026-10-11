/**
 * PageHeader — the shared top bar for every page: a centred title with an
 * optional subtitle and optional controls pinned to the left and right.
 */
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export default function PageHeader({ title, subtitle, leading, trailing }: PageHeaderProps) {
  return (
    <header className="relative flex flex-col items-center justify-center min-h-[76px] px-16 py-4 border-b border-border bg-surface shrink-0">
      {leading && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">{leading}</div>
      )}
      <h1 className="text-3xl font-semibold text-fg">{title}</h1>
      {subtitle && (
        <p className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider mt-1">
          {subtitle}
        </p>
      )}
      {trailing && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{trailing}</div>
      )}
    </header>
  );
}
