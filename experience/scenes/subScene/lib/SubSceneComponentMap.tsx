import { lazy } from "react";

const sceneComponents = {
  shops: lazy(
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
  gatedCommunity: lazy(
    () => import("@/experience/sceneCollections/gatedCommunity/Residential")
  ),
  //   homes: lazy(
  //     () => import("./homesRight/models/HomesRightBuildings")
  //   ),
} as const;

export type SceneType = keyof typeof sceneComponents;
export const getSceneComponent = (type: SceneType) => sceneComponents[type];
