/**
 * removeBg.worker — runs @imgly/background-removal off the main thread and
 * replies with the cutout PNG as a transferred ArrayBuffer, tagged with the
 * caller's requestId.
 */
import { removeBackground } from "@imgly/background-removal";

self.onmessage = async (event) => {
  const { file, requestId } = event.data;

  try {
    const result = await removeBackground(file);
    const arrayBuffer = await result.arrayBuffer();
    self.postMessage(
      { success: true, requestId, buffer: arrayBuffer },
      { transfer: [arrayBuffer] },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    self.postMessage({ success: false, requestId, error: errorMessage });
  }
};
