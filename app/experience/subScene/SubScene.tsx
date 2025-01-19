"use client";
import { ShopsBuildings } from "../sceneCollections/shops/models/ShopsBuildings";
import SubSceneMarkers from "../sceneControllers/poiMarkers/SubSceneMarkers";

export default function SubScene({ scene }: { scene: Sanity.Scene }) {
  return (
    <>
      <ShopsBuildings />
      <SubSceneMarkers scene={scene} />
    </>
  );
}
