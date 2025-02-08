"use client";
import { Suspense, useEffect, useState } from "react";
import {
  getSceneComponent,
  SceneType,
  preloadScene,
} from "./lib/SubSceneComponentMap";
import { Environment } from "@react-three/drei";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import SubSceneMarkers, { PointOfInterest } from "./components/SubSceneMarkers";
import { SubSceneCameraSystem } from "./SubSceneCameraSystem";
import { preloadModel } from "@/experience/utils/modelCache";
import { useSceneStore } from "@/experience/scenes/store/sceneStore";

interface SubSceneProps {
  scene: Sanity.Scene;
  onMarkerClick: (poi: PointOfInterest) => void;
}

export default function SubScene({ scene, onMarkerClick }: SubSceneProps) {
  const { setIsSubscene, setIsLoading } = useCameraStore();
  const modelRotation = useSceneStore((state) => state.modelRotation);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("🎯 Setting isSubscene", { sceneId: scene._id });
    setIsSubscene(true);
  }, [setIsSubscene, scene._id]);

  useEffect(() => {
    if (isLoaded) {
      console.log("🎬 Scene loaded, starting transition");
      useSceneStore.getState().startTransitionIn();
      setIsLoading(false);
    }
  }, [isLoaded, setIsLoading]);

  useEffect(() => {
    if (scene.sceneType && scene.modelFiles) {
      const modelUrls = scene.modelFiles
        .map((file) => file.fileUrl)
        .filter((url): url is string => !!url);

      Promise.all(modelUrls.map(preloadModel)).then(() => {
        setIsLoaded(true);
      });
    }
  }, [scene.sceneType, scene.modelFiles]);

  if (!scene.sceneType) {
    console.warn("❌ No scene type specified");
    return null;
  }

  const SceneComponent = getSceneComponent(scene.sceneType as SceneType);

  return (
    <>
      <SubSceneCameraSystem />
      <group position={[-5, 0, 0]} rotation={[modelRotation, 0, 0]}>
        <Environment preset="sunset" />
        <SubSceneMarkers scene={scene} onMarkerClick={onMarkerClick} />
        <Suspense fallback={null}>
          <SceneComponent
            modelFiles={scene.modelFiles}
            modelIndex={0}
            onLoad={() => {
              console.log("🎯 SceneComponent onLoad triggered");
              setIsLoaded(true);
            }}
          />
        </Suspense>
      </group>
    </>
  );
}
