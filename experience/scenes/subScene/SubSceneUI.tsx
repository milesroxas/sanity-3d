"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useR3F } from "@/experience/providers/R3FContext";
import SubScene from "./SubScene";
import { Carousel3 } from "@/components/ui/carousel/carousel-3";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { PointOfInterest } from "./components/SubSceneMarkers";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { fetchNavigationScenes } from "@/app/(main)/actions";
import { useSceneStore } from "@/experience/scenes/store/sceneStore";
import { AnimatePresence, motion } from "framer-motion";
import { ANIMATION_DURATIONS } from "@/experience/config/animations";

interface NavigationScene {
  slug?: { current: string };
  title: string;
}

export default function SubSceneUI({ scene }: { scene: Sanity.Scene }) {
  const [validScenes, setValidScenes] = useState<NavigationScene[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { setR3FContent } = useR3F();
  const selectedPoi = useCameraStore((state) => state.selectedPoi);
  const setSelectedPoi = useCameraStore((state) => state.setSelectedPoi);
  const poiActive = useSceneStore((state) => state.poiActive);
  const setPOIActive = useSceneStore((state) => state.setPOIActive);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isLoading = useCameraStore((state) => state.isLoading);
  const [uiReady, setUiReady] = useState(false);

  // Track when loading state changes to false and add a delay before showing UI
  useEffect(() => {
    if (isLoading) {
      setUiReady(false);
    } else {
      // Add a delay to ensure loading screen has completely faded out
      const timer = setTimeout(() => {
        setUiReady(true);
      }, ANIMATION_DURATIONS.LOADING_FADE); // Delay to ensure loading animation is complete

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    // Fetch navigation scenes when component mounts
    const getNavigationScenes = async () => {
      const scenes = await fetchNavigationScenes();
      setValidScenes(scenes);
    };
    getNavigationScenes();
  }, []);

  const handleNavigation = async (direction: "next" | "previous") => {
    const currentSlug = pathname?.split("/").pop();
    const currentIndex = validScenes.findIndex(
      (scene) => scene?.slug?.current === currentSlug
    );
    const targetIndex =
      direction === "next"
        ? (currentIndex + 1) % validScenes.length
        : currentIndex === 0
          ? validScenes.length - 1
          : currentIndex - 1;

    const targetScene = validScenes[targetIndex];
    if (!targetScene?.slug?.current) return;

    setIsTransitioning(true);
    setUiReady(false);

    try {
      // Start transition out animation
      console.log("SubSceneUI: Starting transition out");
      await useSceneStore.getState().startTransitionOut();

      // Set loading state to true before navigation
      console.log("SubSceneUI: Setting loading state to true for navigation");
      useCameraStore.getState().setIsLoading(true);

      // Navigate to the new scene
      const targetUrl = `/experience/${targetScene.slug.current}`;
      console.log(`SubSceneUI: Navigating to ${targetUrl}`);
      router.push(targetUrl);

      // The new scene component will handle its own loading state
      setIsTransitioning(false);
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsTransitioning(false);
      useCameraStore.getState().setIsLoading(false);
    }
  };

  const handleReset = () => {
    useCameraStore.getState().setIsSubscene(false);
    const resetCamera = useCameraStore.getState().resetToInitial;
    resetCamera();
    useCameraStore.getState().setSelectedPoi(null);
  };

  // Filter valid points of interest
  const validPointsOfInterest = (scene.pointsOfInterest ?? []).filter(
    (poi): poi is PointOfInterest => (poi as any).markerPosition !== undefined
  );

  const handleMarkerClick = (poi: PointOfInterest) => {
    setIsTransitioning(true);
    setSelectedPoi(poi);

    // Wait for camera transition to complete before showing carousel
    setTimeout(() => {
      setIsTransitioning(false);
      setPOIActive(true);
    }, ANIMATION_DURATIONS.CAMERA_TRANSITION + 800); // Add buffer time after camera transition
  };

  const handleCarouselClose = () => {
    setIsTransitioning(true);
    setPOIActive(false);

    // Reset transitioning state after camera animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2800);
  };

  useEffect(() => {
    setR3FContent(<SubScene scene={scene} onMarkerClick={handleMarkerClick} />);
    return () => {
      setR3FContent(null);
    };
  }, [setR3FContent, scene, setSelectedPoi]);

  useEffect(() => {
    const handleBrowserBack = () => {
      useCameraStore.getState().setIsSubscene(false);
      useCameraStore.getState().resetToInitial();
      useCameraStore.getState().setSelectedPoi(null);
    };

    window.addEventListener("popstate", handleBrowserBack);

    return () => {
      handleBrowserBack();
      window.removeEventListener("popstate", handleBrowserBack);
    };
  }, []);

  const currentSlug = pathname?.split("/").pop();
  const currentIndex = validScenes.findIndex(
    (scene) => scene?.slug?.current === currentSlug
  );

  const canNavigateNext =
    validScenes.length > 1 && currentIndex < validScenes.length - 1;
  const canNavigatePrevious = validScenes.length > 1 && currentIndex > 0;

  // Only show UI when loading is complete AND uiReady is true
  const shouldShowUI = !isLoading && uiReady && !isTransitioning;

  return (
    <div className="relative z-40 mx-auto flex flex-col items-center w-full">
      <AnimatePresence mode="wait">
        {!poiActive && shouldShowUI && (
          <motion.div
            key="nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATIONS.UI_FADE / 1000 }}
            className="flex flex-col items-center w-screen mx-auto"
          >
            <div className="flex justify-center items-center gap-6 w-full">
              {canNavigatePrevious && (
                <button
                  onClick={() => handleNavigation("previous")}
                  className="text-xl font-bold text-center hover:text-primary/70 transition-colors"
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
              )}
              <h2 className="text-xl font-bold text-center">{scene.title}</h2>
              {canNavigateNext && (
                <button
                  onClick={() => handleNavigation("next")}
                  className="text-xl font-bold text-center hover:text-primary/70 transition-colors"
                >
                  <ArrowRightIcon className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed z-20 top-1/2 -translate-y-1/2 right-8 w-full max-w-md px-4 flex items-center">
        <AnimatePresence mode="wait">
          {!poiActive && shouldShowUI && scene.body && (
            <motion.div
              key="body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ANIMATION_DURATIONS.UI_FADE / 1000 }}
              className="w-full"
            >
              <PortableTextRenderer value={scene.body} />
            </motion.div>
          )}
          {poiActive && shouldShowUI && (
            <Carousel3
              key="carousel"
              scene={scene}
              selectedPoi={selectedPoi}
              onClose={handleCarouselClose}
            />
          )}
        </AnimatePresence>
      </div>
      {!poiActive && shouldShowUI && (
        <motion.div
          key="back-button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ANIMATION_DURATIONS.UI_FADE / 1000 }}
          className="fixed bottom-0 left-0 right-0 flex justify-center pb-8"
        >
          <Button
            size="xl"
            onClick={(e) => {
              e.preventDefault();
              handleReset();
              setTimeout(() => {
                router.push("/experience");
              }, 100);
            }}
          >
            Back to Main
          </Button>
        </motion.div>
      )}
    </div>
  );
}
