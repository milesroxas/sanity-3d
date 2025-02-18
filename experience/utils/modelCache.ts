import { useGLTF } from "@react-three/drei";

const loadedModels = new Set<string>();
const loadingPromises = new Map<string, Promise<void>>();

export const preloadModel = async (url: string) => {
  if (!url) return Promise.resolve();

  // If already loaded, return immediately
  if (loadedModels.has(url)) {
    return Promise.resolve();
  }

  // If currently loading, return existing promise
  if (loadingPromises.has(url)) {
    return loadingPromises.get(url);
  }

  const promise = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      loadingPromises.delete(url);
      reject(new Error(`Timeout loading model: ${url}`));
    }, 30000);

    try {
      useGLTF.preload(url);
      loadedModels.add(url);
      clearTimeout(timeout);
      resolve();
    } catch (error) {
      loadingPromises.delete(url);
      reject(error);
    }
  });

  loadingPromises.set(url, promise);
  return promise;
};

export const isModelLoaded = (url: string) => {
  return loadedModels.has(url);
};
