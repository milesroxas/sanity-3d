"use client";
import { Suspense, useEffect, useState } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import { Environment, Html } from "@react-three/drei";
import { CameraSystem } from "@/experience/sceneControllers/CameraSystem";
import { useCameraStore } from "@/experience/sceneControllers/store/cameraStore";
import SubSceneMarkers from "@/experience/sceneControllers/poiMarkers/SubSceneMarkers";
import { Carousel3 } from "@/components/ui/carousel/carousel-3";
export default function SubScene({ scene }: { scene: Sanity.Scene }) {
  const { setIsSubscene, resetToInitial, setIsLoading } = useCameraStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsSubscene(true);
    // Don't set loading false until component signals it's ready
    setIsLoading(true);

    return () => {
      setIsSubscene(false);
      setIsLoading(false);
    };
  }, [setIsSubscene, setIsLoading]);

  useEffect(() => {
    if (isLoaded) {
      // Only reset camera after component is loaded
      resetToInitial();
      // Wait for camera animation to complete before allowing further interactions
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
      <Html>
        <div className="absolute left-0 top-0 w-screen h-screen z-50">
          <div className="flex flex-col gap-4">
            <h2>{scene.title}</h2>
            <Carousel3 pointsOfInterest={scene.pointsOfInterest} />
          </div>
        </div>
      </Html>
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
