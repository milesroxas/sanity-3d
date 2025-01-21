import { lazy } from "react";

const sceneComponents = {
  shops: lazy(
    () => import("@/app/experience/sceneCollections/shops/ShopsSubScene")
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
  //   gatedCommunity: lazy(
  //     () => import("./gatedCommunity/GatedCommunity")
  //   ),
  //   homes: lazy(
  //     () => import("./homesRight/models/HomesRightBuildings")
  //   ),
} as const;

export type SceneType = keyof typeof sceneComponents;
export const getSceneComponent = (type: SceneType) => sceneComponents[type];
