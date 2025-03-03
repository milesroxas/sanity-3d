"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import { Environment, useProgress } from "@react-three/drei";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import SubSceneMarkers, { PointOfInterest } from "./components/SubSceneMarkers";
import { SubSceneCameraSystem } from "./SubSceneCameraSystem";
import { useSceneStore } from "@/experience/scenes/store/sceneStore";
import { ANIMATION_DURATIONS } from "@/experience/config/animations";
import {
  preloadModelsForScene,
  isModelLoaded,
} from "@/experience/utils/modelCache";
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
  const groupRef = useRef<THREE.Group>(null);
  const { progress, active } = useProgress();
  const [sceneReady, setSceneReady] = useState(false);
  const sceneIdRef = useRef(scene._id);
  const isNewScene = sceneIdRef.current !== scene._id;
  const visitedScenesRef = useRef<Set<string>>(new Set());
  const loadStartTimeRef = useRef<number>(0);
  const wasHiddenRef = useRef(false);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("SubScene: Tab hidden, marking for reset");
        wasHiddenRef.current = true;
      } else if (wasHiddenRef.current) {
        console.log("SubScene: Tab visible again, resetting loading state");
        wasHiddenRef.current = false;

        // If we're in the middle of loading, force completion
        if (!sceneReady || useCameraStore.getState().isLoading) {
          console.log("SubScene: Tab visibility changed, forcing scene ready");

          // Clear any transition timers
          if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = null;
          }

          // Mark scene as ready and add to visited scenes
          setSceneReady(true);
          visitedScenesRef.current.add(scene._id);

          // End loading and start transition
          setIsLoading(false);
          useSceneStore.getState().startTransitionIn();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [scene._id, setIsLoading]);

  // Handle scene changes
  useEffect(() => {
    if (isNewScene) {
      console.log(
        `SubScene: Scene changed from ${sceneIdRef.current} to ${scene._id}`
      );
      sceneIdRef.current = scene._id;
      setSceneReady(false);

      // Reset the hidden flag when changing scenes
      wasHiddenRef.current = false;

      // Record the start time for loading
      loadStartTimeRef.current = Date.now();

      // Check if we've visited this scene before
      const hasVisitedBefore = visitedScenesRef.current.has(scene._id);

      // Check if all models are already loaded
      const allModelsLoaded =
        !scene.modelFiles ||
        scene.modelFiles.every(
          (file) => !file.fileUrl || isModelLoaded(file.fileUrl)
        );

      // Skip loading screen if we've visited this scene before or all models are loaded
      if (hasVisitedBefore || allModelsLoaded) {
        console.log(
          `SubScene: Skipping loading screen for scene ${scene._id} - ${hasVisitedBefore ? "visited before" : "all models loaded"}`
        );
        setSceneReady(true);
        // Don't show loading screen
        setIsLoading(false);
        // Start transition immediately
        useSceneStore.getState().startTransitionIn();
      } else {
        // Show loading screen for new scenes with unloaded models
        setIsLoading(true);
      }
    }
  }, [scene._id, isNewScene, setIsLoading, scene.modelFiles]);

  // Set subscene state when component mounts
  useEffect(() => {
    setIsSubscene(true);

    // Preload models for this scene if not already loaded
    if (scene.modelFiles && !sceneReady && !wasHiddenRef.current) {
      const modelUrls = scene.modelFiles
        .map((file) => file.fileUrl)
        .filter((url): url is string => !!url);

      // Check if all models are already loaded
      const allModelsLoaded = modelUrls.every((url) => isModelLoaded(url));

      if (allModelsLoaded) {
        console.log(
          `SubScene: All models already loaded for scene ${scene._id}`
        );
        setSceneReady(true);
        // Skip loading if all models are loaded
        setIsLoading(false);
        // Start transition immediately
        useSceneStore.getState().startTransitionIn();
        return;
      }

      console.log(
        `SubScene: Preloading ${modelUrls.length} models for scene ${scene._id}`
      );

      // Preload models
      preloadModelsForScene(modelUrls)
        .then(() => {
          console.log(`SubScene: All models preloaded for scene ${scene._id}`);
          setSceneReady(true);
          // Add to visited scenes
          visitedScenesRef.current.add(scene._id);

          // Check if loading took less than 1 second
          const loadTime = Date.now() - loadStartTimeRef.current;
          if (loadTime < 1000) {
            console.log(
              `SubScene: Loading completed in ${loadTime}ms, skipping loading screen`
            );
            // Skip loading screen if loading was fast
            setIsLoading(false);
            // Start transition immediately
            useSceneStore.getState().startTransitionIn();
          }
        })
        .catch((error) => {
          console.error("Error preloading models:", error);
          // Still mark as ready to prevent getting stuck
          setSceneReady(true);
          // Add to visited scenes
          visitedScenesRef.current.add(scene._id);
        });
    } else if (!scene.modelFiles) {
      // No models to load
      setSceneReady(true);
      // Add to visited scenes
      visitedScenesRef.current.add(scene._id);
    }

    return () => {
      console.log("SubScene: Component unmounting");
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [
    scene._id,
    scene.modelFiles,
    setIsSubscene,
    setIsLoading,
    sceneReady,
    wasHiddenRef,
  ]);

  // Handle progress updates from drei's useProgress
  useEffect(() => {
    // Skip processing if tab was hidden and became visible again
    if (wasHiddenRef.current) return;

    console.log(
      `SubScene: Loading progress ${progress.toFixed(1)}%, Active: ${active}, SceneReady: ${sceneReady}`
    );

    // When progress reaches 100% and loading is complete or all models are already cached
    if ((progress === 100 && !active) || (sceneReady && !active)) {
      console.log(
        "SubScene: Progress complete or models cached, starting transition"
      );

      // Add to visited scenes
      visitedScenesRef.current.add(scene._id);

      // Start transition if not already started
      if (useCameraStore.getState().isLoading) {
        useSceneStore.getState().startTransitionIn();

        // Check if loading took less than 1 second
        const loadTime = Date.now() - loadStartTimeRef.current;
        if (loadTime < 1000) {
          console.log(
            `SubScene: Loading completed in ${loadTime}ms, skipping loading screen`
          );
          // Skip loading screen if loading was fast
          setIsLoading(false);
        } else {
          // Keep loading state true until transition is complete
          const transitionDuration = ANIMATION_DURATIONS.TRANSITION_IN;
          const loadingFadeDuration = ANIMATION_DURATIONS.LOADING_FADE;
          const totalDelay = transitionDuration + loadingFadeDuration;

          console.log(
            `SubScene: Will set loading to false after ${totalDelay}ms`
          );

          // Clear any existing transition timer
          if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
          }

          transitionTimerRef.current = setTimeout(() => {
            console.log("SubScene: Setting loading state to false");
            setIsLoading(false);
            transitionTimerRef.current = null;
          }, totalDelay);
        }
      }
    }
  }, [progress, active, setIsLoading, sceneReady, scene._id, wasHiddenRef]);

  // Add GSAP animation effect for rotation
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        x: modelRotation,
        duration: ANIMATION_DURATIONS.MODEL_ROTATION / 1000, // Convert to seconds for GSAP
        ease: "power2.out",
      });
    }
  }, [modelRotation]);

  if (!scene.sceneType) {
    return null;
  }

  const SceneComponent = getSceneComponent(scene.sceneType as SceneType);

  return (
    <>
      <SubSceneCameraSystem />
      <EffectComposer>
        <Vignette
          offset={0.3}
          darkness={0.5}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
        <Bloom intensity={0.02} threshold={0.5} radius={2} />
        <ToneMapping
          blendFunction={BlendFunction.NORMAL}
          adaptive={true}
          resolution={256}
          middleGrey={0.5}
          maxLuminance={8.0}
          averageLuminance={1.0}
          adaptationRate={1.0}
        />
      </EffectComposer>
      <group ref={groupRef} position={[-5, 0, 0]}>
        <Environment
          preset="sunset"
          backgroundBlurriness={0.5}
          background
          backgroundIntensity={1}
        />
        <rectAreaLight
          position={[0, 5, 10]}
          width={20}
          height={20}
          intensity={4}
          color="pink"
        />
        <SubSceneMarkers
          scene={scene}
          onMarkerClick={onMarkerClick}
          poiActive={useSceneStore.getState().poiActive}
        />
        <Suspense fallback={null}>
          <SceneComponent modelFiles={scene.modelFiles} modelIndex={0} />
        </Suspense>
      </group>
    </>
  );
}
