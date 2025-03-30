"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import MainScene from "@/experience/scenes/mainScene/MainScene";
import { useEffect, useRef, useState } from "react";
import { useCameraStore } from "../store/cameraStore";
import LogoMarkerContent from "./components/LogoMarkerContent";
import { useLogoMarkerStore } from "../store/logoMarkerStore";
import { AnimatePresence, motion } from "framer-motion";
import { useSceneStore } from "../store/sceneStore";
import { Loading } from "../components/Loading";

// Style to prevent scrollbars
const noScrollStyles = {

  height: '100%',
  width: '100%',
};

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent, setAssetsLoaded, canvasOpacity } = useR3F();
  const setIsLoading = useCameraStore((state) => state.setIsLoading);
  const isLoading = useCameraStore((state) => state.isLoading);
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const setIsTransitioning = useSceneStore((state) => state.setIsTransitioning);
  const reset = useLogoMarkerStore((state) => state.reset);
  const [assetsReady, setAssetsReady] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);
  const cameraTransitionStarted = useRef(false);
  const mainSceneRef = useRef<{ startCameraTransition: () => void } | null>(null);

  // Handle canvas opacity changes
  useEffect(() => {
    // When canvas is becoming visible but camera transition hasn't started yet
    if (canvasOpacity > 0.2 && assetsReady && !cameraTransitionStarted.current) {
      console.log("Canvas visible, starting camera transition");
      cameraTransitionStarted.current = true;
      
      // Trigger camera transition in MainScene
      if (mainSceneRef.current) {
        mainSceneRef.current.startCameraTransition();
      }
    }
  }, [canvasOpacity, assetsReady]);

  // Monitor loading state to control UI visibility
  useEffect(() => {
    if (!isLoading && !isTransitioning && assetsReady) {
      // Loading is complete and assets are ready - show UI after a delay
      const uiTimer = setTimeout(() => {
        setUiVisible(true);
      }, 1000);
      
      return () => clearTimeout(uiTimer);
    }
  }, [isLoading, isTransitioning, assetsReady]);

  useEffect(() => {
    // Reset the logo marker store when component mounts
    reset();
    
    // Set loading state when component mounts
    setIsLoading(true);
    
    // Make sure transition state is reset as well
    if (isTransitioning) {
      setIsTransitioning(false);
    }

    // Prevent scrollbars from appearing
    document.body.style.overflow = 'hidden';

    // Set assets as not loaded initially
    setAssetsLoaded(false);
    cameraTransitionStarted.current = false;

    // Render the 3D scene
    setR3FContent(
      <MainScene
        scene={scene}
        ref={mainSceneRef}
        startTransitionsAfterLoad={true} // Signal that camera transitions should wait
        onLoad={() => {
          // This gets called when all 3D assets are ready
          setAssetsReady(true);
          
          // Signal that assets are loaded to R3F context
          setAssetsLoaded(true);
          
          // Explicitly set loading to false
          setIsLoading(false);
        }}
      />
    );

    return () => {
      setR3FContent(null);
      setIsLoading(false);
      setAssetsLoaded(false);
      setUiVisible(false);
      
      // Make sure transition state is reset
      if (isTransitioning) {
        setIsTransitioning(false);
      }
      
      // Restore default overflow setting
      document.body.style.overflow = '';
    };
  }, [setR3FContent, scene, setIsLoading, setIsTransitioning, isTransitioning, reset, setAssetsLoaded]);

  return (
    <div style={noScrollStyles}>
      {/* Loading component */}
      <Loading />
      
      <AnimatePresence>
        {uiVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LogoMarkerContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
