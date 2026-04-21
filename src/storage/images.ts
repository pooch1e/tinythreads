import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'tinythreads';
const DB_VERSION = 1;
const STORE_NAME = 'images';

type TinyThreadsDB = {
  images: {
    key: string;
    value: Blob;
  };
};

let dbPromise: Promise<IDBPDatabase<TinyThreadsDB>> | null = null;

function getDB(): Promise<IDBPDatabase<TinyThreadsDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TinyThreadsDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function saveImage(id: string, blob: Blob): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, blob, id);
}

export async function getImageBlob(id: string): Promise<Blob | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function getImageUrl(id: string): Promise<string | null> {
  const blob = await getImageBlob(id);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function deleteImage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
