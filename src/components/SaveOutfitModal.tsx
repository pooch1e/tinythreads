import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SaveOutfitModalProps {
  onSave: (name: string) => void;
  onCancel: () => void;
}

export default function SaveOutfitModal({ onSave, onCancel }: SaveOutfitModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please give your outfit a name.');
      return;
    }
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-[430px] bg-white dark:bg-[#111827] rounded-t-3xl px-5 py-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-gray-800 dark:text-[#edf2fb] text-center">Name your outfit</h3>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="e.g. Sunday park walk"
          maxLength={60}
          className="w-full px-4 py-3 rounded-2xl border border-[#ccdbfd] dark:border-[#263352] bg-white dark:bg-[#1a2332] text-sm text-gray-800 dark:text-[#edf2fb] placeholder-gray-400 dark:placeholder-[#7a90c0] focus:outline-none focus:border-[#abc4ff] focus:ring-2 focus:ring-[#d7e3fc] dark:focus:ring-[#1a2442]"
        />

        {error && (
          <p className="text-xs text-red-500 -mt-2">{error}</p>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-[colors,transform] active:scale-95 bg-[#abc4ff] text-white active:bg-[#92aaee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50"
          >
            Save outfit
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 bg-[#edf2fb] dark:bg-[#1a2332] text-gray-700 dark:text-[#b6ccfe] rounded-2xl font-semibold text-sm active:bg-[#d7e3fc] dark:active:bg-[#263352] active:scale-95 transition-[colors,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
