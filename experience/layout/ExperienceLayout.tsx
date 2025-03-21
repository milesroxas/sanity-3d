"use client";

import { ReactNode, useEffect, useState } from "react";
import ExperienceNav from "@/components/header/experience-nav";
import { useSceneStore } from "../scenes/store/sceneStore";
import { useCameraStore } from "../scenes/store/cameraStore";
import { useProgress } from "@react-three/drei";
import { useR3F } from "../providers/R3FContext";

interface ExperienceLayoutProps {
  children: ReactNode;
}

export default function ExperienceLayout({ children }: ExperienceLayoutProps) {
  const [navVisible, setNavVisible] = useState(false);
  const { progress } = useProgress();
  const { assetsLoaded, canvasOpacity } = useR3F();
  
  // Single effect to handle nav visibility based on camera and scene state
  useEffect(() => {
    // Listen to both camera and scene stores for state changes
    const unsubscribe = useCameraStore.subscribe((cameraState) => {
      const sceneState = useSceneStore.getState();
      
      if (
        !cameraState.isAnimating && 
        !cameraState.isLoading &&
        !sceneState.isTransitioning &&
        assetsLoaded && 
        progress === 100 && 
        canvasOpacity > 0.9
      ) {
        // Add a short delay to ensure everything has settled
        const timer = setTimeout(() => {
          setNavVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
      } else {
        setNavVisible(false);
      }
    });
    
    return () => unsubscribe();
  }, [assetsLoaded, progress, canvasOpacity]);

  return (
    <div className="w-full h-full overflow-hidden" style={{ pointerEvents: 'none' }}>
      <div style={{ pointerEvents: 'auto' }}>
        <ExperienceNav visible={navVisible} />
      </div>
      <div style={{ pointerEvents: 'auto' }} className="w-full h-full">
        {children}
      </div>
    </div>
  );
} 