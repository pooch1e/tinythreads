import { removeBackground, type ImageSource } from "@imgly/background-removal";

type RemoveBgProps = {
  file: ImageSource;
};

export async function removeBg({ file }: RemoveBgProps): Promise<Blob> {
  try {
    return await removeBackground(file);
  } catch (error) {
    throw new Error(`Error removing image background: ${error}`);
  }
}
