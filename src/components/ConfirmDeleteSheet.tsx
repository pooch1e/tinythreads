/**
 * ConfirmDeleteSheet — bottom sheet asking the user to confirm a destructive
 * delete. Focuses Cancel on open so Enter never deletes by accident.
 */
import BottomSheet from "@/components/BottomSheet";
import { DANGER_BUTTON, SECONDARY_BUTTON, SHEET_BUTTON } from "@/constants/styles";

interface ConfirmDeleteSheetProps {
  title: string;
  body: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteSheet({
  title,
  body,
  onConfirm,
  onCancel,
}: ConfirmDeleteSheetProps) {
  return (
    <BottomSheet title={title} onClose={onCancel}>
      <p className="text-sm text-fg-muted text-center">{body}</p>
      <div className="flex flex-col gap-2 pt-1">
        <button onClick={onConfirm} className={`${SHEET_BUTTON} ${DANGER_BUTTON}`}>
          Delete
        </button>
        <button
          onClick={onCancel}
          autoFocus
          className={`${SHEET_BUTTON} ${SECONDARY_BUTTON}`}
        >
          Cancel
        </button>
      </div>
    </BottomSheet>
  );
}
