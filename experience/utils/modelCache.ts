import { useGLTF } from "@react-three/drei";
import { DefaultLoadingManager } from "three";

// Use a Set to track which models have been loaded
const loadedModels = new Set<string>();

// Add a debug flag to enable/disable verbose logging
const DEBUG_LOGGING = false;

// We don't need to override these handlers as useProgress already uses them
// Just add some debug logging if needed
DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  if (DEBUG_LOGGING || url.includes(".glb") || url.includes(".gltf")) {
    console.log(`Started loading: ${url} (${itemsLoaded}/${itemsTotal})`);
  }
};

DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  if (DEBUG_LOGGING || url.includes(".glb") || url.includes(".gltf")) {
    console.log(`Loading progress: ${url} (${itemsLoaded}/${itemsTotal})`);
  }
};

DefaultLoadingManager.onLoad = () => {
  if (DEBUG_LOGGING) {
    console.log("Loading complete");
  }
};

DefaultLoadingManager.onError = (url) => {
  console.error(`Error loading: ${url}`);
  // Still mark as loaded to prevent infinite loading attempts
  if (url.includes(".glb") || url.includes(".gltf")) {
    loadedModels.add(url);
  }
};

// Simple function to preload a model using drei's useGLTF.preload
export const preloadModel = async (url: string) => {
  if (!url) return Promise.resolve();

  // If already loaded, return immediately
  if (loadedModels.has(url)) {
    console.log(`Model already loaded and cached: ${url}`);
    return Promise.resolve();
  }

  // Log loading start
  console.log(`Starting to load model: ${url}`);

  try {
    // Use drei's built-in preload function
    useGLTF.preload(url);

    // Mark as loaded
    loadedModels.add(url);
    console.log(`Model loaded and added to cache: ${url}`);

    // Return a resolved promise
    return Promise.resolve();
  } catch (error) {
    console.error(`Error preloading model: ${url}`, error);
    // Still mark as loaded to prevent infinite loading attempts
    loadedModels.add(url);
    return Promise.resolve();
  }
};

// Check if a model is already loaded
export const isModelLoaded = (url: string) => {
  if (!url) return true; // Consider empty URLs as "loaded"

  const isLoaded = loadedModels.has(url);
  if (DEBUG_LOGGING) {
    console.log(
      `Model check: ${url} is ${isLoaded ? "already loaded" : "not loaded yet"}`
    );
  }
  return isLoaded;
};

// Utility function to preload all models for a scene
export const preloadModelsForScene = (modelUrls: string[]) => {
  if (!modelUrls || modelUrls.length === 0) {
    console.log("No models to preload for scene");
    return Promise.resolve();
  }

  console.log(`Preloading ${modelUrls.length} models for scene`);

  // Filter out already loaded models
  const unloadedModels = modelUrls.filter((url) => !loadedModels.has(url));

  if (unloadedModels.length === 0) {
    console.log("All models already loaded for scene");
    return Promise.resolve();
  }

  console.log(`Need to load ${unloadedModels.length} models for scene`);
  return Promise.all(unloadedModels.map(preloadModel));
};

// Get all loaded models (useful for debugging)
export const getLoadedModels = () => {
  return Array.from(loadedModels);
};

// Clear the loaded models cache (useful for testing)
export const clearModelCache = () => {
  loadedModels.clear();
  console.log("Model cache cleared");
};
