import { useState, useEffect, useCallback } from 'react';
import { downloadModelIfNeeded, isModelDownloaded } from '../storage/model';
import { initSession, isBackgroundRemovalSupported } from '../services/backgroundRemoval';

export type ModelStatus = 'idle' | 'downloading' | 'loading' | 'ready' | 'error';

interface ModelState {
  status: ModelStatus;
  progress: number; // 0–1 during download
  error: string | null;
}

let globalStatus: ModelStatus = 'idle';
let globalListeners: Array<(state: ModelState) => void> = [];

function notifyListeners(state: ModelState) {
  globalListeners.forEach((fn) => fn(state));
}

/**
 * Kick off model download + session load. Called once from the root layout.
 * Uses a module-level singleton so multiple hook instances share state.
 */
export async function startModelInit() {
  if (globalStatus === 'ready' || globalStatus === 'downloading' || globalStatus === 'loading') {
    return;
  }

  if (!isBackgroundRemovalSupported()) {
    globalStatus = 'error';
    notifyListeners({
      status: 'error',
      progress: 0,
      error: 'Background removal requires a custom dev build.',
    });
    return;
  }

  try {
    // Check if already downloaded
    const downloaded = await isModelDownloaded();

    if (!downloaded) {
      globalStatus = 'downloading';
      notifyListeners({ status: 'downloading', progress: 0, error: null });

      await downloadModelIfNeeded((progress) => {
        notifyListeners({ status: 'downloading', progress, error: null });
      });
    }

    globalStatus = 'loading';
    notifyListeners({ status: 'loading', progress: 1, error: null });

    await initSession();

    globalStatus = 'ready';
    notifyListeners({ status: 'ready', progress: 1, error: null });
  } catch (err) {
    globalStatus = 'error';
    const message = err instanceof Error ? err.message : 'Unknown error';
    notifyListeners({ status: 'error', progress: 0, error: message });
  }
}

export function useModelStatus(): ModelState {
  const [state, setState] = useState<ModelState>({
    status: globalStatus,
    progress: 0,
    error: null,
  });

  const listener = useCallback((next: ModelState) => {
    setState(next);
  }, []);

  useEffect(() => {
    globalListeners.push(listener);
    // Sync current state on mount
    setState({ status: globalStatus, progress: 0, error: null });
    return () => {
      globalListeners = globalListeners.filter((l) => l !== listener);
    };
  }, [listener]);

  return state;
}
