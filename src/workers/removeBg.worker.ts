import { removeBg } from "../utils/removeBg";

self.onmessage = async (event) => {
  const { file } = event.data;

  try {
    const result = await removeBg({ file });
    const arrayBuffer = await result.arrayBuffer();
    self.postMessage(
      { success: true, buffer: arrayBuffer },
      { transfer: [arrayBuffer] },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    self.postMessage({ success: false, error: errorMessage });
  }
};
