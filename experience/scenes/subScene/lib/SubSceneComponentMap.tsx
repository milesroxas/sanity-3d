import { lazy } from "react";
import { preloadModel } from "@/experience/utils/modelPreloader";

const withLoading = (importFn: () => Promise<any>) => {
  let Component: any = null;
  return lazy(async () => {
    if (!Component) {
      Component = await importFn();
    }
    return Component;
  });
};

const sceneComponents = {
  shops: withLoading(
    () => import("@/experience/sceneCollections/shops/ShopsSubScene")
  ),
  company: withLoading(
    () => import("@/experience/sceneCollections/shops/ShopsSubScene")
  ),
  events: withLoading(
    () => import("@/experience/sceneCollections/shops/ShopsSubScene")
  ),
  gatedCommunity: withLoading(
    () =>
      import("@/experience/sceneCollections/gatedCommunity/ResidentialSubScene")
  ),
} as const;

export type SceneType = keyof typeof sceneComponents;

export const preloadScene = (sceneType: SceneType, modelUrls: string[]) => {
  // Only preload model files
  modelUrls.forEach(preloadModel);
};

export const getSceneComponent = (type: SceneType) => sceneComponents[type];
