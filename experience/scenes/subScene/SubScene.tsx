"use client";
import { useEffect, useMemo, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { PointOfInterest } from "./components/SubSceneMarkers";
import SubSceneMarkers from "./components/SubSceneMarkers";
import { MaterialTransitionManager } from "@/experience/components/MaterialTransitionManager";
import { useSceneStore } from "@/experience/scenes/store/sceneStore";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SubSceneProps {
  scene: Sanity.Scene;
  onMarkerClick: (poi: PointOfInterest) => void;
}

export default function SubScene({ scene, onMarkerClick }: SubSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { camera } = useThree();
  const modelRotation = useSceneStore((state) => state.modelRotation);
  const poiActive = useSceneStore((state) => state.poiActive);
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const startTransitionIn = useSceneStore((state) => state.startTransitionIn);
  const groupRef = useRef<THREE.Group>(null);
  
  // Guard against null scene
  if (!scene) {
    return null;
  }
  
  // Get valid points of interest safely
  const validPointsOfInterest = useMemo(() => {
    if (!scene.pointsOfInterest) return [];
    
    return scene.pointsOfInterest.filter(
      (poi): poi is PointOfInterest => (poi as any).markerPosition !== undefined
    );
  }, [scene.pointsOfInterest]);

  // Start transition safely
  useEffect(() => {
    if (startTransitionIn) {
      try {
        startTransitionIn();
      } catch (error) {
        console.error("Error starting transition:", error);
      }
    }
  }, [startTransitionIn, scene]);

  // Camera initialization
  useEffect(() => {
    if (cameraRef.current) {
      camera.position.set(0, 5, 30);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);

  // Safely update camera store
  useEffect(() => {
    const cameraStore = useCameraStore.getState();
    if (!cameraStore) return;
    
    if (typeof cameraStore.setIsSubscene === 'function') {
      cameraStore.setIsSubscene(true);
    }
    
    return () => {
      if (cameraStore && typeof cameraStore.setIsSubscene === 'function') {
        cameraStore.setIsSubscene(false);
      }
    };
  }, []);

  // Frame update with error handling
  useFrame(() => {
    try {
      if (!isTransitioning) {
        // Your frame update logic here
      }
    } catch (error) {
      console.error("Error in frame update:", error);
    }
  });

  // Get file URLs safely
  const modelUrls = useMemo(() => {
    if (!scene.modelFiles || !Array.isArray(scene.modelFiles)) {
      return [];
    }
    
    return scene.modelFiles
      .filter(file => file && file.fileUrl)
      .map(file => file.fileUrl || '');
  }, [scene.modelFiles]);
  
  return (
    <>
      <MaterialTransitionManager group={groupRef.current} />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        near={0.1}
        far={1000}
        fov={45}
        position={[0, 5, 30]}
      />
      <group ref={groupRef} rotation={[0, modelRotation, 0]}>
        {validPointsOfInterest.length > 0 && (
          <SubSceneMarkers
            scene={scene}
            onMarkerClick={onMarkerClick}
            poiActive={poiActive}
          />
        )}
        {/* Model loading would go here */}
      </group>
    </>
  );
}
