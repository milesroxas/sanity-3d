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
  //   company: lazy(
  //     () => import("./company/models/CompanyBuildings")
  //   ),
  //   resort: lazy(
  //     () => import("./resort/models/ResortBuildings")
  //   ),
  //   events: lazy(
  //     () => import("./events/models/EventsBuildings")
  //   ),
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
