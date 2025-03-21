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

interface NavigationScene {
  slug?: { current: string };
  title: string;
}

export default function SubSceneUI({ scene }: { scene: Sanity.Scene }) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [validScenes, setValidScenes] = useState<NavigationScene[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { setR3FContent } = useR3F();
  const selectedPoi = useCameraStore((state) => state.selectedPoi);
  const setSelectedPoi = useCameraStore((state) => state.setSelectedPoi);
  const poiActive = useSceneStore((state) => state.poiActive);
  const setPOIActive = useSceneStore((state) => state.setPOIActive);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Fetch navigation scenes when component mounts
    const getNavigationScenes = async () => {
      try {
        const scenes = await fetchNavigationScenes();
        setValidScenes(scenes || []);
      } catch (error) {
        console.error("Failed to fetch navigation scenes:", error);
        setValidScenes([]);
      }
    };
    getNavigationScenes();
  }, []);

  const handleNavigation = async (direction: "next" | "previous") => {
    if (isNavigating) return; // Prevent multiple navigation attempts
    
    const currentSlug = pathname?.split("/").pop();
    if (!currentSlug || validScenes.length === 0) return;
    
    const currentIndex = validScenes.findIndex(
      (scene) => scene?.slug?.current === currentSlug
    );
    
    if (currentIndex === -1) return;
    
    const targetIndex =
      direction === "next"
        ? (currentIndex + 1) % validScenes.length
        : currentIndex === 0
          ? validScenes.length - 1
          : currentIndex - 1;

    const targetScene = validScenes[targetIndex];
    if (!targetScene?.slug?.current) return;

    setIsTransitioning(true);
    setIsNavigating(true);

    try {
      // Start transition with safeguards
      const sceneStore = useSceneStore.getState();
      if (typeof sceneStore.startTransitionOut === 'function') {
        await sceneStore.startTransitionOut();
      }
      
      const targetUrl = `/experience/${targetScene.slug.current}`;
      router.push(targetUrl);

      // Only show loading if transition takes too long
      const loadingTimer = setTimeout(() => {
        const cameraStore = useCameraStore.getState();
        if (cameraStore && typeof cameraStore.setIsLoading === 'function') {
          cameraStore.setIsLoading(true);
        }
      }, 1000);

      setTimeout(() => {
        clearTimeout(loadingTimer);
        setIsTransitioning(false);
        setIsNavigating(false);
        const cameraStore = useCameraStore.getState();
        if (cameraStore && typeof cameraStore.setIsLoading === 'function') {
          cameraStore.setIsLoading(false);
        }
      }, 800);
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsTransitioning(false);
      setIsNavigating(false);
      const cameraStore = useCameraStore.getState();
      if (cameraStore && typeof cameraStore.setIsLoading === 'function') {
        cameraStore.setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    const cameraStore = useCameraStore.getState();
    if (!cameraStore) return;
    
    if (typeof cameraStore.setIsSubscene === 'function') {
      cameraStore.setIsSubscene(false);
    }
    
    if (typeof cameraStore.resetToInitial === 'function') {
      cameraStore.resetToInitial();
    }
    
    if (typeof cameraStore.setSelectedPoi === 'function') {
      cameraStore.setSelectedPoi(null);
    }
  };

  // Filter valid points of interest
  const validPointsOfInterest = (scene?.pointsOfInterest ?? []).filter(
    (poi): poi is PointOfInterest => 
      poi && (poi as any).markerPosition !== undefined
  );

  const handleMarkerClick = (poi: PointOfInterest) => {
    if (!poi) return;
    setIsTransitioning(true);
    setSelectedPoi(poi);

    // Wait for camera transition to complete before showing carousel
    setTimeout(() => {
      setIsTransitioning(false);
      setPOIActive(true);
    }, 2800);
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
    if (scene) {
      setR3FContent(<SubScene scene={scene} onMarkerClick={handleMarkerClick} />);
    }
    return () => {
      setR3FContent(null);
    };
  }, [setR3FContent, scene, setSelectedPoi]);

  useEffect(() => {
    const handleBrowserBack = () => {
      const cameraStore = useCameraStore.getState();
      if (!cameraStore) return;
      
      if (typeof cameraStore.setIsSubscene === 'function') {
        cameraStore.setIsSubscene(false);
      }
      
      if (typeof cameraStore.resetToInitial === 'function') {
        cameraStore.resetToInitial();
      }
      
      if (typeof cameraStore.setSelectedPoi === 'function') {
        cameraStore.setSelectedPoi(null);
      }
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

  // If scene is undefined or null, render a fallback UI
  if (!scene) {
    return (
      <div className="relative z-50 mx-auto flex flex-col items-center w-full text-white">
        <p>Loading scene...</p>
      </div>
    );
  }

  return (
    <div className="relative z-50 mx-auto flex flex-col items-center w-full">
      <AnimatePresence mode="wait">
        {!poiActive && !isTransitioning && (
          <motion.div
            key="nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-screen mx-auto"
          >
            <div className="flex justify-center items-center gap-6 w-full">
              {canNavigatePrevious && (
                <button
                  style={{ color: "white" }}
                  onClick={() => !isNavigating && handleNavigation("previous")}
                  className="text-xl font-bold text-center hover:text-primary/70 transition-colors"
                  disabled={isNavigating}
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
              )}
              <h2 className="text-xl font-bold text-center text-white">{scene.title}</h2>
              {canNavigateNext && (
                <button
                  style={{ color: "white" }}
                  onClick={() => !isNavigating && handleNavigation("next")}
                  className="text-xl font-bold text-center hover:text-primary/70 transition-colors"
                  disabled={isNavigating}
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
          {!poiActive && !isTransitioning && scene.body && (
            <motion.div
              key="body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="text-white">
                <PortableTextRenderer value={scene.body} />
              </div>
            </motion.div>
          )}
          {poiActive && !isTransitioning && selectedPoi && (
            <Carousel3
              key="carousel"
              scene={scene}
              selectedPoi={selectedPoi}
              onClose={handleCarouselClose}
            />
          )}
        </AnimatePresence>
      </div>
      {!poiActive && !isTransitioning && (
        <motion.div
          key="back-button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
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
