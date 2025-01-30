"use client";
import { Suspense, useEffect } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import { Environment } from "@react-three/drei";
import { CameraSystem } from "@/experience/sceneControllers/CameraSystem";
import { useCameraStore } from "@/experience/sceneControllers/store/cameraStore";

export default function SubScene({ scene }: { scene: Sanity.Scene }) {
  const { setIsSubscene, resetToInitial } = useCameraStore();

  useEffect(() => {
    // Set subscene state and reset camera to initial subscene position
    setIsSubscene(true);
    resetToInitial();

    return () => {
      setIsSubscene(false);
    };
  }, [setIsSubscene, resetToInitial]);

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
