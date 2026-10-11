/**
 * removeBg — main-thread client for the background-removal web worker.
 * Multiplexes concurrent requests over one lazily created worker and rejects
 * everything in flight if the worker dies, so callers never hang.
 */

type WorkerMessage = {
  file: File | Blob;
  requestId: number;
};

type WorkerResponse =
  | { success: true; requestId: number; buffer: ArrayBuffer }
  | { success: false; requestId: number; error: string };

type PendingRequest = {
  resolve: (blob: Blob) => void;
  reject: (error: Error) => void;
};

let nextRequestId = 0;
let worker: Worker | null = null;
const pending = new Map<number, PendingRequest>();

function failAll(error: Error) {
  for (const request of pending.values()) request.reject(error);
  pending.clear();
  worker?.terminate();
  worker = null;
}

function handleMessage(event: MessageEvent<WorkerResponse>) {
  const request = pending.get(event.data.requestId);
  if (!request) return;
  pending.delete(event.data.requestId);

  if (event.data.success) {
    request.resolve(new Blob([event.data.buffer], { type: "image/png" }));
  } else {
    request.reject(new Error(event.data.error));
  }
}

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL("../workers/removeBg.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", (event) => {
      event.preventDefault();
      failAll(new Error(event.message || "Background removal worker crashed"));
    });
    worker.addEventListener("messageerror", () => {
      failAll(new Error("Background removal worker sent an unreadable message"));
    });
  }

  return worker;
}

export function removeBgAsync(file: File | Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const activeWorker = getWorker();
    const requestId = (nextRequestId += 1);
    pending.set(requestId, { resolve, reject });
    activeWorker.postMessage({ file, requestId } satisfies WorkerMessage);
  });
}
