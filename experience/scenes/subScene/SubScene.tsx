"use client";
import { Suspense } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import SubSceneMarkers from "@/experience/sceneControllers/poiMarkers/SubSceneMarkers";
import { Environment } from "@react-three/drei";
import { CameraSystem } from "@/experience/sceneControllers/CameraSystem";

export default function SubScene({ scene }: { scene: Sanity.Scene }) {
  if (!scene.sceneType) {
    console.warn("No scene type specified");
    return null;
  }

  const SceneComponent = getSceneComponent(scene.sceneType as SceneType);

  return (
    <>
      <CameraSystem scene={scene} />
      <Environment preset="sunset" />
      <Suspense fallback={<>Loading...</>}>
        <SceneComponent modelFiles={scene.modelFiles} modelIndex={0} />
      </Suspense>
    </>
  );
}
