import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLooks } from '@/hooks/useLooks';
import { useWardrobe } from '@/hooks/useWardrobe';
import type { SavedLook } from '@/types';
import { MAX_LOOKS } from '@/constants/limits';
import LookCard from '@/components/LookCard';
import EmptyState from '@/components/EmptyState';
import ConfirmDeleteSheet from '@/components/ConfirmDeleteSheet';

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
        <div className="px-4 py-4 border-b border-[#d7e3fc] dark:border-[#263352]">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-[#edf2fb]">Outfits</h1>
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
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#d7e3fc] dark:border-[#263352]">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-[#edf2fb]">Outfits</h1>
        <span className="text-xs text-gray-400 dark:text-[#7a90c0] font-medium">
          {looks.length} / {MAX_LOOKS}
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

      {pendingDelete && (
        <ConfirmDeleteSheet
          title={`Delete "${pendingDelete.name}"?`}
          body="This outfit will be permanently deleted. The individual clothing items will not be affected."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
