/**
 * OutfitsPage — /outfits. Lists saved outfits newest first, with a count
 * against the saved-outfit limit and confirm-to-delete.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLooks } from "@/hooks/useLooks";
import { useWardrobe } from "@/hooks/useWardrobe";
import type { SavedLook } from "@/types";
import { MAX_LOOKS } from "@/constants/limits";
import PageHeader from "@/components/PageHeader";
import LookCard from "@/components/LookCard";
import EmptyState from "@/components/EmptyState";
import ConfirmDeleteSheet from "@/components/ConfirmDeleteSheet";

export default function OutfitsPage() {
  const navigate = useNavigate();
  const { looks, deleteLook } = useLooks();
  const { items } = useWardrobe();
  const [pendingDelete, setPendingDelete] = useState<SavedLook | null>(null);

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return;
    deleteLook(pendingDelete.id);
    setPendingDelete(null);
  };

  if (looks.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Outfits" />
        <EmptyState
          icon="📸"
          title="No outfits saved yet"
          description="Head to the Build tab to compose and save your first outfit."
          actionLabel="Build an outfit"
          onAction={() => navigate("/build")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Outfits"
        trailing={
          <span className="text-xs text-fg-muted font-medium">
            {looks.length} / {MAX_LOOKS}
          </span>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {looks.map((look) => (
            <motion.div
              key={look.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <LookCard
                look={look}
                allItems={items}
                onDelete={() => setPendingDelete(look)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {pendingDelete && (
          <ConfirmDeleteSheet
            title={`Delete "${pendingDelete.name}"?`}
            body="This outfit will be permanently deleted. The individual clothing items will not be affected."
            onConfirm={handleDeleteConfirm}
            onCancel={() => setPendingDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
