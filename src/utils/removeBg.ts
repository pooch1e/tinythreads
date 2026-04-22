let nextRequestId = 0;
let worker: Worker | null = null;

type WorkerMessage = {
  file: File | Blob;
  requestId: number;
};

type WorkerResponse =
  | { success: true; requestId: number; buffer: ArrayBuffer }
  | { success: false; requestId: number; error: string };

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL("../workers/removeBg.worker.ts", import.meta.url), {
      type: "module",
    });
  }

  return worker;
}

export function removeBgAsync(file: File | Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const activeWorker = getWorker();
    const requestId = nextRequestId += 1;
    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.requestId !== requestId) {
        return;
      }

      activeWorker.removeEventListener("message", handleMessage);
      const { success } = event.data;
      if (success) {
        resolve(new Blob([event.data.buffer], { type: "image/png" }));
      } else {
        reject(new Error(event.data.error));
      }
    };

    activeWorker.addEventListener("message", handleMessage);
    activeWorker.postMessage({ file, requestId } satisfies WorkerMessage);
  });
}
