"use client";
import { Suspense, useEffect, useState } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import { Environment } from "@react-three/drei";
import { CameraSystem } from "@/experience/sceneControllers/CameraSystem";
import { useCameraStore } from "@/experience/sceneControllers/store/cameraStore";
import SubSceneMarkers from "@/experience/sceneControllers/poiMarkers/SubSceneMarkers";
export default function SubScene({ scene }: { scene: Sanity.Scene }) {
  const { setIsSubscene, setIsLoading } = useCameraStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("SubScene mount effect triggered");
    setIsSubscene(true);
  }, [setIsSubscene]);

  useEffect(() => {
    console.log("isLoaded effect triggered, isLoaded:", isLoaded);
    if (isLoaded) {
      console.log("Setting loading to false because model is loaded");
      setIsLoading(false);
    }
  }, [isLoaded, setIsLoading]);

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
          onLoad={() => {
            console.log("SceneComponent onLoad triggered");
            setIsLoaded(true);
          }}
        />
      </Suspense>
    </>
  );
}
