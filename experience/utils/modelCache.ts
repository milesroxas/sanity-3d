import { useGLTF } from "@react-three/drei";

const loadedModels = new Set<string>();
const loadingPromises = new Map<string, Promise<void>>();

export const preloadModel = async (url: string) => {
  if (!url || loadedModels.has(url)) return;

  if (!loadingPromises.has(url)) {
    const promise = new Promise<void>((resolve) => {
      useGLTF.preload(url);
      loadedModels.add(url);
      resolve();
    });
    loadingPromises.set(url, promise);
  }

  return loadingPromises.get(url);
};

export const isModelPreloaded = (url: string) => loadedModels.has(url);
