"use client";
import { Suspense, useEffect, useState } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import { Environment, Html } from "@react-three/drei";
import { CameraSystem } from "@/experience/sceneControllers/CameraSystem";
import { useCameraStore } from "@/experience/sceneControllers/store/cameraStore";
import SubSceneMarkers from "@/experience/sceneControllers/poiMarkers/SubSceneMarkers";
export default function SubScene({ scene }: { scene: Sanity.Scene }) {
  const { setIsSubscene, resetToInitial, setIsLoading } = useCameraStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsSubscene(true);
    setIsLoading(true);

    return () => {
      setIsSubscene(false);
      setIsLoading(false);
    };
  }, [setIsSubscene, setIsLoading]);

  useEffect(() => {
    if (isLoaded) {
      resetToInitial();
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isLoaded, resetToInitial, setIsLoading]);

  if (!scene.sceneType) {
    console.warn("No scene type specified");
    return null;
  }

  const SceneComponent = getSceneComponent(scene.sceneType as SceneType);

  return (
    <>
      <CameraSystem scene={scene} />
      <Environment preset="sunset" />
      <SubSceneMarkers scene={scene} />
      <Suspense fallback={null}>
        <SceneComponent
          modelFiles={scene.modelFiles}
          modelIndex={0}
          onLoad={() => setIsLoaded(true)}
        />
      </Suspense>
    </>
  );
}
