/**
 * BottomSheet — animated modal sheet that slides up from the bottom of the
 * mobile shell, with a dismissable backdrop, dialog semantics and Escape to
 * close. Render inside <AnimatePresence> for the exit animation.
 */
import { useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useEscapeToClose } from "@/hooks/useEscapeToClose";

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({ title, onClose, children }: BottomSheetProps) {
  const titleId = useId();
  useEscapeToClose(onClose);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-[430px] bg-surface rounded-t-3xl px-5 py-6 space-y-4"
      >
        <h3 id={titleId} className="text-base font-semibold text-fg text-center">
          {title}
        </h3>
        {children}
      </motion.div>
    </div>
  );
}
