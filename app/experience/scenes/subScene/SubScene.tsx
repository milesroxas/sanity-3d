"use client";
import { Suspense } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import SubSceneMarkers from "@/app/experience/sceneControllers/poiMarkers/SubSceneMarkers";
import { Environment } from "@react-three/drei";

export default function SubScene({ scene }: { scene: Sanity.Scene }) {
  if (!scene.sceneType) {
    console.warn("No scene type specified");
    return null;
  }

  const SceneComponent = getSceneComponent(scene.sceneType as SceneType);

  return (
    <>
      <Environment preset="sunset" />
      <Suspense fallback={null}>
        <SceneComponent modelFiles={scene.modelFiles} modelIndex={0} />
      </Suspense>
      <SubSceneMarkers scene={scene} />
    </>
  );
}
