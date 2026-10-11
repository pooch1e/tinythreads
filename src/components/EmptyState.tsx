/**
 * EmptyState — centred placeholder shown when a page has nothing to display,
 * with an optional call-to-action button.
 */
import { PRIMARY_BUTTON } from "@/constants/styles";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6 pb-16">
      <span className="text-6xl" aria-hidden="true">{icon}</span>
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <p className="text-sm text-fg-muted max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`mt-2 px-6 py-3 rounded-2xl font-semibold text-sm ${PRIMARY_BUTTON}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
