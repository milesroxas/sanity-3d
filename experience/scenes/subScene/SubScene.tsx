"use client";
import { Suspense, useEffect, useState } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import { Environment } from "@react-three/drei";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import SubSceneMarkers, { PointOfInterest } from "./components/SubSceneMarkers";
import { SubSceneCameraSystem } from "./SubSceneCameraSystem";

interface SubSceneProps {
  scene: Sanity.Scene;
  onMarkerClick: (poi: PointOfInterest) => void;
}

export default function SubScene({ scene, onMarkerClick }: SubSceneProps) {
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
      <SubSceneCameraSystem />
      <group position={[-5, 0, 0]}>
        <Environment preset="sunset" />
        <SubSceneMarkers scene={scene} onMarkerClick={onMarkerClick} />
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
      </group>
    </>
  );
}
