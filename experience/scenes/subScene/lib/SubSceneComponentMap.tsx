import { lazy } from "react";

const withLoading = (importFn: () => Promise<any>) =>
  lazy(async () => {
    const component = await importFn();
    // Remove artificial delay since we're handling timing in the component
    return component;
  });

const sceneComponents = {
  shops: withLoading(
    () => import("@/experience/sceneCollections/shops/ShopsSubScene")
  ),
  company: withLoading(
    () => import("@/experience/sceneCollections/shops/ShopsSubScene")
  ),
  //   resort: lazy(
  //     () => import("./resort/models/ResortBuildings")
  //   ),
  events: withLoading(
    () => import("@/experience/sceneCollections/shops/ShopsSubScene")
  ),
  //   farm: lazy(() => import("./farm/models/FarmBuildings")),
  //   construction: lazy(
  //     () =>
  //       import("./construction/models/ConstructionBuildings")
  //   ),
  gatedCommunity: withLoading(
    () =>
      import("@/experience/sceneCollections/gatedCommunity/ResidentialSubScene")
  ),
  //   homes: lazy(
  //     () => import("./homesRight/models/HomesRightBuildings")
  //   ),
} as const;

export type SceneType = keyof typeof sceneComponents;
export const getSceneComponent = (type: SceneType) => sceneComponents[type];
