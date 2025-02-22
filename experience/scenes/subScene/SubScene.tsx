"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import { Environment, Stars } from "@react-three/drei";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import SubSceneMarkers, { PointOfInterest } from "./components/SubSceneMarkers";
import { SubSceneCameraSystem } from "./SubSceneCameraSystem";
import { preloadModel, isModelLoaded } from "@/experience/utils/modelCache";
import { useSceneStore } from "@/experience/scenes/store/sceneStore";
import gsap from "gsap";
import * as THREE from "three";
import { Bloom, ToneMapping } from "@react-three/postprocessing";
import { Vignette } from "@react-three/postprocessing";
import { EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

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
    setIsSubscene(true);
  }, [setIsSubscene, scene._id]);

  useEffect(() => {
    if (isLoaded) {
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
    return null;
  }

  const SceneComponent = getSceneComponent(scene.sceneType as SceneType);

  return (
    <>
      <SubSceneCameraSystem />
      <Stars radius={100} count={2000} factor={2} saturation={0} speed={1} />
      <EffectComposer>
        <Vignette
          offset={0.3} // vignette offset
          darkness={0.3} // vignette darkness
          eskil={false} // Eskil's vignette technique
          blendFunction={BlendFunction.NORMAL} // blend mode
        />
        <Bloom
          intensity={0.02} // Adjust bloom intensity
          threshold={0.5} // Adjust threshold for bloom
          radius={2} // Adjust bloom radius
        />
        <ToneMapping
          blendFunction={BlendFunction.NORMAL} // blend mode
          adaptive={true} // toggle adaptive luminance map usage
          resolution={256} // texture resolution of the luminance map
          middleGrey={0.3} // middle grey factor
          maxLuminance={15.0} // maximum luminance
          averageLuminance={2.0} // average luminance
          adaptationRate={1.0} // luminance adaptation rate
        />
      </EffectComposer>
      <group ref={groupRef} position={[-5, 0, 0]}>
        <Environment
          preset="sunset"
          backgroundBlurriness={0.5}
          background
          backgroundIntensity={0.1}
        />
        <rectAreaLight
          position={[0, 5, 10]}
          width={20}
          height={20}
          intensity={3}
          color="purple"
        />
        <SubSceneMarkers
          scene={scene}
          onMarkerClick={onMarkerClick}
          poiActive={useSceneStore.getState().poiActive}
        />
        <Suspense fallback={null}>
          <SceneComponent
            modelFiles={scene.modelFiles}
            modelIndex={0}
            onLoad={() => {
              setIsLoaded(true);
            }}
          />
        </Suspense>
      </group>
    </>
  );
}
