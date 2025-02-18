"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import {
  getSceneComponent,
  SceneType,
  preloadScene,
} from "./lib/SubSceneComponentMap";
import { Environment } from "@react-three/drei";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import SubSceneMarkers, { PointOfInterest } from "./components/SubSceneMarkers";
import { SubSceneCameraSystem } from "./SubSceneCameraSystem";
import { preloadModel, isModelLoaded } from "@/experience/utils/modelCache";
import { useSceneStore } from "@/experience/scenes/store/sceneStore";
import gsap from "gsap";
import type * as THREE from "three";

interface SubSceneProps {
  scene: Sanity.Scene;
  onMarkerClick: (poi: PointOfInterest) => void;
}

export default function SubScene({ scene, onMarkerClick }: SubSceneProps) {
  const { setIsSubscene, setIsLoading } = useCameraStore();
  const modelRotation = useSceneStore((state) => state.modelRotation);
  const [isLoaded, setIsLoaded] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    console.log("🎯 Setting isSubscene", { sceneId: scene._id });
    setIsSubscene(true);
  }, [setIsSubscene, scene._id]);

  useEffect(() => {
    if (isLoaded) {
      console.log("🎬 Scene loaded, starting transition");
      useSceneStore.getState().startTransitionIn();
      // Delay clearing loading state to allow for smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 800); // Increased from 300 to 800 to match other transitions
    }
  }, [isLoaded, setIsLoading]);

  // Add GSAP animation effect for rotation
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        x: modelRotation,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [modelRotation]);

  useEffect(() => {
    if (scene.sceneType && scene.modelFiles) {
      const modelUrls = scene.modelFiles
        .map((file) => file.fileUrl)
        .filter((url): url is string => !!url);

      // Check if all models are already loaded
      const allModelsLoaded = modelUrls.every(isModelLoaded);

      if (allModelsLoaded) {
        setIsLoaded(true);
        return;
      }

      // Start a timer to show loading only if it takes too long
      const loadingTimer = setTimeout(() => {
        if (!useSceneStore.getState().isTransitioning) {
          setIsLoading(true);
        }
      }, 1000);

      Promise.all(modelUrls.map(preloadModel))
        .then(() => {
          clearTimeout(loadingTimer);
          setIsLoaded(true);
          setIsLoading(false);
        })
        .catch((error) => {
          clearTimeout(loadingTimer);
          console.error("Failed to load models:", error);
          setIsLoading(false);
        });

      return () => clearTimeout(loadingTimer);
    }
  }, [scene.sceneType, scene.modelFiles, setIsLoading]);

  if (!scene.sceneType) {
    console.warn("❌ No scene type specified");
    return null;
  }

  const SceneComponent = getSceneComponent(scene.sceneType as SceneType);

  return (
    <>
      <SubSceneCameraSystem />
      <group ref={groupRef} position={[-5, 0, 0]}>
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
