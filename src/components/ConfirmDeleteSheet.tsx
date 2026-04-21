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
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCancel}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Sheet */}
      <div
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl px-5 py-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-gray-800 text-center">{title}</h3>
        <p className="text-sm text-gray-500 text-center">{body}</p>
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 bg-red-500 text-white rounded-2xl font-semibold text-sm active:bg-red-600 active:scale-95 transition-all"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm active:bg-gray-200 active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
