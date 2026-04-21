import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLooks } from '@/hooks/useLooks';
import { useWardrobe } from '@/hooks/useWardrobe';
import type { SavedLook } from '@/types';
import LookCard from '@/components/LookCard';
import EmptyState from '@/components/EmptyState';

// ── Confirmation dialog ──────────────────────────────────────

interface ConfirmDeleteProps {
  look: SavedLook;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDeleteDialog({ look, onConfirm, onCancel }: ConfirmDeleteProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl px-5 py-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-gray-800 text-center">
          Delete "{look.name}"?
        </h3>
        <p className="text-sm text-gray-500 text-center">
          This outfit will be permanently deleted. The individual clothing items will not be affected.
        </p>
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

// ── Main page ────────────────────────────────────────────────

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
        <div className="px-4 py-4 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-800">Outfits</h1>
        </div>
        <EmptyState
          icon="📸"
          title="No outfits saved yet"
          description="Head to the Build tab to compose and save your first outfit."
          actionLabel="Build an outfit"
          onAction={() => navigate('/build')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-800">Outfits</h1>
        <span className="text-xs text-gray-400 font-medium">
          {looks.length} / 10
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {looks.map((look) => (
          <LookCard
            key={look.id}
            look={look}
            allItems={items}
            onDelete={() => setPendingDelete(look)}
          />
        ))}
      </div>

      {/* Delete confirmation sheet */}
      {pendingDelete && (
        <ConfirmDeleteDialog
          look={pendingDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
