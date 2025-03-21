"use client";
import { useCameraStore } from "../store/cameraStore";
import { useSceneStore } from "../store/sceneStore";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "@react-three/drei";

export function Loading() {
  // Safely check if stores are available - only run this component on 3D experience pages
  const [isStoreAvailable, setIsStoreAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { progress } = useProgress();
  const [show, setShow] = useState(false);
  
  // Safely check if the stores are available
  useEffect(() => {
    try {
      // Check if we're on a page that needs 3D loading
      if (typeof window !== 'undefined' && window.location.pathname.includes('/experience')) {
        setIsStoreAvailable(true);
        // Access stores only if we're on an experience page
        const cameraState = useCameraStore.getState();
        const sceneState = useSceneStore.getState();
        
        if (cameraState && sceneState) {
          setIsLoading(cameraState.isLoading || false);
          setIsTransitioning(sceneState.isTransitioning || false);
        }
      }
    } catch (error) {
      console.error("Store access error:", error);
      setIsStoreAvailable(false);
    }
  }, []);
  
  // Only subscribe to stores if they're available
  useEffect(() => {
    if (!isStoreAvailable) return;
    
    // Set up subscription to camera store for isLoading
    const unsubscribeCamera = useCameraStore.subscribe(
      state => setIsLoading(state.isLoading || false)
    );
    
    // Set up subscription to scene store for isTransitioning
    const unsubscribeScene = useSceneStore.subscribe(
      state => setIsTransitioning(state.isTransitioning || false)
    );
    
    return () => {
      unsubscribeCamera();
      unsubscribeScene();
    };
  }, [isStoreAvailable]);

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (isLoading || isTransitioning) {
      // Only show loading if state persists for more than 1 second
      showTimer = setTimeout(() => setShow(true), 1000);
    } else {
      hideTimer = setTimeout(() => setShow(false), 300);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading, isTransitioning]);

  // Calculate loading percentage, ensuring it's between 0-100 and rounded
  const loadingProgress = Math.min(100, Math.max(0, Math.round(progress)));

  // Don't render anything if the store isn't available
  if (!isStoreAvailable) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-primary backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-none"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-primary text-xl font-medium">
              Loading...({loadingProgress}%)
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
