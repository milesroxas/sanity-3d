"use client";
import { useCameraStore } from "../store/cameraStore";
import { useSceneStore } from "../store/sceneStore";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "@react-three/drei";

export function Loading() {
  const [show, setShow] = useState(false);  // Start hidden by default
  const { progress, active } = useProgress();
  const { isLoading } = useCameraStore();
  const { isTransitioning } = useSceneStore();
  
  // Add state for smoothed progress
  const [smoothProgress, setSmoothProgress] = useState(0);
  const lastProgressRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  
  // Reset progress when loading starts
  useEffect(() => {
    if (isLoading || isTransitioning || active) {
      // Only reset if this is a new loading sequence
      if (!hasStartedRef.current) {
        setSmoothProgress(0);
        lastProgressRef.current = 0;
        hasStartedRef.current = true;
      }
      setShow(true);
      return;
    }
    
    // When all loading is complete
    if (smoothProgress < 100) {
      setSmoothProgress(100);
    }
    
    // Fade out when loading is complete
    const hideTimer = setTimeout(() => {
      setShow(false);
      // Reset for next time
      hasStartedRef.current = false;
    }, 800);
    
    return () => clearTimeout(hideTimer);
  }, [isLoading, isTransitioning, active, smoothProgress]);
  
  // Smooth progress animation
  useEffect(() => {
    // If not loading, don't process progress changes
    if (!isLoading && !isTransitioning && !active && !hasStartedRef.current) {
      return;
    }
    
    // Real progress from loading system
    const targetProgress = Math.min(100, Math.max(0, Math.round(progress)));
    
    // Prevent progress from going backwards
    const effectiveTarget = Math.max(targetProgress, lastProgressRef.current);
    
    // If we're already at target, no need to animate
    if (smoothProgress === effectiveTarget) {
      return;
    }
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Create smooth animation towards target
    const startTime = Date.now();
    const startValue = smoothProgress;
    const duration = 500; // Slightly faster for more responsive feel
    
    const animateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progressRatio = Math.min(1, elapsed / duration);
      
      // Ease out function for smoother deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);
      const easedProgress = easeOut(progressRatio);
      
      // Calculate new smoothed value
      const newValue = startValue + (effectiveTarget - startValue) * easedProgress;
      const roundedValue = Math.min(100, Math.round(newValue));
      setSmoothProgress(roundedValue);
      
      // Store the highest progress we've seen
      lastProgressRef.current = Math.max(lastProgressRef.current, newValue);
      
      // Continue animation if not complete
      if (progressRatio < 1) {
        animationRef.current = requestAnimationFrame(animateProgress);
      } else {
        animationRef.current = null;
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animateProgress);
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [progress, smoothProgress, isLoading, isTransitioning, active]);
  
  // On unmount, clear any ongoing animations
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-primary/90 backdrop-blur-md flex items-center justify-center z-[100] pointer-events-none"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-xl font-medium">
              Loading...({smoothProgress}%)
            </p>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${smoothProgress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
