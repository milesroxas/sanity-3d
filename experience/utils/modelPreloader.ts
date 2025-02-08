const modelCache = new Map<string, Promise<any>>();

export const preloadModel = (url: string) => {
  if (!modelCache.has(url)) {
    const loader = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = () => resolve(URL.createObjectURL(xhr.response));
      xhr.onerror = reject;
      xhr.send();
    });
    modelCache.set(url, loader);
  }
  return modelCache.get(url);
};

export const clearModelCache = () => {
  modelCache.forEach((promise) => {
    promise.then((url) => URL.revokeObjectURL(url));
  });
  modelCache.clear();
};
