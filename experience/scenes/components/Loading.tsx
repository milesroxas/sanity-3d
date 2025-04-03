'use client';
import { useCameraStore } from '../store/cameraStore';
import { useSceneStore } from '../store/sceneStore';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import Image from 'next/image';

export function Loading() {
  const [show, setShow] = useState(false); // Start hidden by default
  const { progress, active } = useProgress();
  const { isLoading } = useCameraStore();
  const { isTransitioning } = useSceneStore();

  // Add state for smoothed progress
  const [smoothProgress, setSmoothProgress] = useState(0);
  const lastProgressRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const isInitialLoadCompleteRef = useRef(false);
  const lastActiveStateRef = useRef(active);

  // Reset progress when loading starts
  useEffect(() => {
    // Track changes in active state to detect tab visibility changes
    const isTabVisibilityChange = lastActiveStateRef.current !== active;
    lastActiveStateRef.current = active;

    // Handle loading states
    if (isLoading || isTransitioning || (active && !isTabVisibilityChange)) {
      // Only reset if this is a new loading sequence
      if (!hasStartedRef.current) {
        setSmoothProgress(0);
        lastProgressRef.current = 0;
        hasStartedRef.current = true;
      }
      setShow(true);
      return;
    }

    // Mark initial load as complete once we reach 100%
    if (smoothProgress >= 100) {
      isInitialLoadCompleteRef.current = true;
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
    }, 1200); // Increased delay to match total animation duration

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
    const duration = 1000; // Slightly faster for more responsive feel

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
          transition={{ duration: 0.8 }}
          className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="container flex flex-col items-center gap-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Image src="/images/logo.webp" alt="logo" width={100} height={100} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-xl font-medium text-primary"
            >
              Loading...({smoothProgress}%)
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="h-4 w-full overflow-hidden rounded-full bg-[#216020]"
            >
              <div
                className="h-full bg-[#80DA7E] transition-all duration-300 ease-out"
                style={{ width: `${smoothProgress}%` }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
