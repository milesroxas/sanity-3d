"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import MainScene from "@/experience/scenes/mainScene/MainScene";
import { useEffect, useRef } from "react";
import { useCameraStore } from "../store/cameraStore";
import { useProgress } from "@react-three/drei";

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();
  const setIsLoading = useCameraStore((state) => state.setIsLoading);
  const isSubscene = useCameraStore((state) => state.isSubscene);
  const { progress, active } = useProgress();
  const prevProgressRef = useRef(progress);
  const maxLoadingTimeRef = useRef<NodeJS.Timeout | null>(null);
  const loadingCompletedRef = useRef(false);
  const loadStartTimeRef = useRef<number>(0);
  const wasHiddenRef = useRef(false);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("MainSceneClient: Tab hidden, marking for reset");
        wasHiddenRef.current = true;
      } else if (wasHiddenRef.current) {
        console.log(
          "MainSceneClient: Tab visible again, resetting loading state"
        );
        wasHiddenRef.current = false;

        // If we're currently in a loading state and not in a subscene, reset it
        if (!loadingCompletedRef.current && !isSubscene) {
          // Clear any existing timers
          if (maxLoadingTimeRef.current) {
            clearTimeout(maxLoadingTimeRef.current);
            maxLoadingTimeRef.current = null;
          }

          // Force loading completion
          console.log(
            "MainSceneClient: Tab visibility changed, forcing loading completion"
          );
          loadingCompletedRef.current = true;
          setIsLoading(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSubscene, setIsLoading]);

  // Set up the MainScene component
  useEffect(() => {
    // Only set loading state when not in a subscene
    if (!isSubscene) {
      setIsLoading(true);
      loadingCompletedRef.current = false;
      loadStartTimeRef.current = Date.now();
      console.log("MainSceneClient: Loading started");

      // Set a maximum loading time to prevent getting stuck
      if (maxLoadingTimeRef.current) {
        clearTimeout(maxLoadingTimeRef.current);
      }

      maxLoadingTimeRef.current = setTimeout(() => {
        console.log(
          "MainSceneClient: Maximum loading time reached, forcing completion"
        );
        if (!loadingCompletedRef.current) {
          loadingCompletedRef.current = true;
          setIsLoading(false);
        }
      }, 15000); // 15 second maximum loading time
    }

    // Set up the R3F content
    setR3FContent(<MainScene scene={scene} />);

    return () => {
      // Clean up
      if (maxLoadingTimeRef.current) {
        clearTimeout(maxLoadingTimeRef.current);
        maxLoadingTimeRef.current = null;
      }
      loadingCompletedRef.current = false;
    };
  }, [scene, setR3FContent, setIsLoading, isSubscene]);

  // Handle progress updates from drei's useProgress
  useEffect(() => {
    // Only process loading updates when not in a subscene
    if (isSubscene) return;

    // Skip processing if tab was hidden and became visible again
    if (wasHiddenRef.current) return;

    console.log(
      `MainSceneClient: Loading progress ${progress.toFixed(1)}%, Active: ${active}`
    );

    // Detect if progress is stalled
    if (
      progress > 0 &&
      progress === prevProgressRef.current &&
      progress < 100 &&
      active
    ) {
      const stallCheckTimeout = setTimeout(() => {
        console.log("MainSceneClient: Progress appears to be stalled");
        // We don't force completion here, just log it
      }, 5000);

      return () => clearTimeout(stallCheckTimeout);
    }

    // When progress reaches 100% and loading is complete
    if (progress === 100 && !active && !loadingCompletedRef.current) {
      // Calculate loading time
      const loadTime = Date.now() - loadStartTimeRef.current;
      console.log(`MainSceneClient: Loading completed in ${loadTime}ms`);

      // Give a small delay to ensure everything is rendered
      const timer = setTimeout(
        () => {
          console.log("MainSceneClient: Progress complete, ending loading");
          setIsLoading(false);
          loadingCompletedRef.current = true;

          // Clear the maximum loading time timeout
          if (maxLoadingTimeRef.current) {
            clearTimeout(maxLoadingTimeRef.current);
            maxLoadingTimeRef.current = null;
          }
        },
        loadTime < 1000 ? 0 : 500
      ); // No delay if loading was fast

      return () => clearTimeout(timer);
    }

    // Update previous progress
    prevProgressRef.current = progress;
  }, [progress, active, setIsLoading, isSubscene, wasHiddenRef]);

  return null;
}
