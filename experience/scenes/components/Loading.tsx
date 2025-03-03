"use client";
import { useProgress } from "@react-three/drei";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { useEffect, useState, useRef } from "react";
import { ANIMATION_DURATIONS } from "@/experience/config/animations";

export default function Loading() {
  const { progress, active, item } = useProgress();
  const { setControlType, isLoading } = useCameraStore();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // Start invisible
  const prevLoadingRef = useRef(isLoading);
  const maxLoadingTimeRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wasHiddenRef = useRef(false);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Loading: Tab hidden, marking for reset");
        wasHiddenRef.current = true;
      } else if (wasHiddenRef.current) {
        console.log("Loading: Tab visible again, resetting loading state");
        wasHiddenRef.current = false;

        // If we're currently in a loading state, reset it
        if (isLoading) {
          // Clear any existing timers
          if (delayTimerRef.current) {
            clearTimeout(delayTimerRef.current);
            delayTimerRef.current = null;
          }

          if (maxLoadingTimeRef.current) {
            clearTimeout(maxLoadingTimeRef.current);
            maxLoadingTimeRef.current = null;
          }

          // Hide loading screen immediately if it was visible
          if (isVisible) {
            setDisplayProgress(100);
            setTimeout(() => {
              setIsVisible(false);
            }, ANIMATION_DURATIONS.LOADING_FADE);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoading, isVisible]);

  // Handle loading state changes
  useEffect(() => {
    // When loading starts
    if (isLoading && !prevLoadingRef.current) {
      console.log("Loading: Loading started");

      // Don't show loading screen immediately
      // Only show it if loading takes longer than 1 second
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }

      delayTimerRef.current = setTimeout(() => {
        // Only show loading screen if still loading after 1 second
        if (isLoading && active) {
          console.log(
            "Loading: Still loading after 1 second, showing loading screen"
          );
          setDisplayProgress(Math.max(5, progress)); // Start with some visible progress
          setIsVisible(true);
        }
      }, 1000); // 1 second delay before showing loading screen

      // Set a maximum loading time to prevent getting stuck
      if (maxLoadingTimeRef.current) {
        clearTimeout(maxLoadingTimeRef.current);
      }

      maxLoadingTimeRef.current = setTimeout(() => {
        console.log(
          "Loading: Maximum loading time reached, forcing completion"
        );
        setDisplayProgress(100);

        // Give a small delay for the progress bar to animate to 100%
        setTimeout(() => {
          setIsVisible(false);
          // Also update the camera store to ensure we're not stuck in loading state
          setControlType("Map");
        }, ANIMATION_DURATIONS.LOADING_FADE);
      }, 15000); // 15 second maximum loading time
    }

    // When loading ends
    if (!isLoading && prevLoadingRef.current) {
      console.log("Loading: Loading ended");

      // Clear the delay timer
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }

      // Clear the maximum loading time timeout
      if (maxLoadingTimeRef.current) {
        clearTimeout(maxLoadingTimeRef.current);
        maxLoadingTimeRef.current = null;
      }

      // Only hide if it was visible
      if (isVisible) {
        // Complete the progress bar
        setDisplayProgress(100);

        // Hide after animation completes
        setTimeout(() => {
          setIsVisible(false);
        }, ANIMATION_DURATIONS.LOADING_FADE);
      }
    }

    // Update previous loading state
    prevLoadingRef.current = isLoading;

    return () => {
      if (maxLoadingTimeRef.current) {
        clearTimeout(maxLoadingTimeRef.current);
      }
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
    };
  }, [isLoading, setControlType, active, progress, isVisible]);

  // Update display progress smoothly
  useEffect(() => {
    if (isLoading && isVisible) {
      // Smoothly animate progress
      if (progress > displayProgress) {
        const interval = setInterval(() => {
          setDisplayProgress((prev) => {
            const increment = progress === 100 ? 1 : 0.5;
            const newProgress = Math.min(prev + increment, progress);
            if (newProgress >= progress) {
              clearInterval(interval);
            }
            return newProgress;
          });
        }, 20);

        return () => clearInterval(interval);
      }
    }
  }, [progress, displayProgress, isLoading, isVisible]);

  // Disable controls during loading
  useEffect(() => {
    if (isLoading) {
      setControlType("Disabled");
    }
  }, [isLoading, setControlType]);

  // Debug loading progress
  useEffect(() => {
    console.log(
      `Loading progress: ${progress.toFixed(1)}%, Item: ${item}, Active: ${active}, isLoading: ${isLoading}, isVisible: ${isVisible}`
    );
  }, [progress, item, active, isLoading, isVisible]);

  // If not visible, don't render anything
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 p-12 w-screen h-screen z-50 flex flex-col items-center justify-center bg-gradient-to-r from-slate-500 to-yellow-100 ${!isLoading ? `animate-loading-screen` : ""}`}
    >
      <div className="w-6/12 m-auto">
        <h2 className="text-center mb-8 text-2xl text-white">
          Loading Experience
        </h2>
        <div className="w-full h-8 p-2 bg-white relative rounded-sm overflow-hidden">
          <div
            className="w-[0px] h-full bg-primary rounded-sm transition-width duration-500 ease-in-out"
            style={{ width: `${displayProgress}%` }}
          ></div>
        </div>
        {/* Show current loading item for debugging */}
        <div className="text-center mt-2 text-xs text-white opacity-50">
          {item && `Loading: ${item}`}
        </div>
      </div>
    </div>
  );
}
