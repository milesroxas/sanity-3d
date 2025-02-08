"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useR3F } from "@/experience/providers/R3FContext";
import SubScene from "./SubScene";
import { Carousel3 } from "@/components/ui/carousel/carousel-3";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { PointOfInterest } from "./components/SubSceneMarkers";
import { Vector3 } from "three";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";

export default function SubSceneUI({ scene }: { scene: Sanity.Scene }) {
  const [showCarousel, setShowCarousel] = useState(false);
  const router = useRouter();
  const { setR3FContent } = useR3F();
  const selectedPoi = useCameraStore((state) => state.selectedPoi);
  const setSelectedPoi = useCameraStore((state) => state.setSelectedPoi);

  // Get all scenes for navigation
  const validScenes = (scene.pointsOfInterest ?? []).filter(
    (poi): poi is any => {
      return !!(
        poi &&
        "_type" in poi &&
        "_id" in poi &&
        poi._type === "scenes" &&
        "mainSceneMarkerPosition" in poi &&
        poi.mainSceneMarkerPosition &&
        "slug" in poi &&
        poi.slug?.current
      );
    }
  );

  const handleNavigation = (direction: "next" | "previous") => {
    // Find current scene index by matching current URL slug
    const currentSlug = window.location.pathname.split("/").pop();
    const currentIndex = validScenes.findIndex(
      (scene: any) => scene?.slug?.current === currentSlug
    );

    const targetIndex =
      direction === "next"
        ? (currentIndex + 1) % validScenes.length
        : currentIndex === 0
          ? validScenes.length - 1
          : currentIndex - 1;

    const targetScene = validScenes[targetIndex];

    if (!(targetScene as any)?.slug?.current) {
      console.warn("No valid target scene found");
      return;
    }

    // Set loading state immediately
    useCameraStore.getState().setIsLoading(true);

    // Navigate after a delay
    setTimeout(() => {
      const targetUrl = `/experience/${(targetScene as any).slug.current}`;
      router.push(targetUrl);
    }, 2000);
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
    setSelectedPoi(poi);
    setShowCarousel(true);
  };

  useEffect(() => {
    console.log("SubSceneUI mount effect");
    setR3FContent(<SubScene scene={scene} onMarkerClick={handleMarkerClick} />);
    return () => {
      console.log("SubSceneUI cleanup effect");
      setR3FContent(null);
    };
  }, [setR3FContent, scene, setSelectedPoi]);

  useEffect(() => {
    // Setup browser back button listener
    const handleBrowserBack = () => {
      useCameraStore.getState().setIsSubscene(false);
      useCameraStore.getState().resetToInitial();
      useCameraStore.getState().setSelectedPoi(null);
    };

    window.addEventListener("popstate", handleBrowserBack);

    // Cleanup function
    return () => {
      handleBrowserBack();
      window.removeEventListener("popstate", handleBrowserBack);
    };
  }, []);

  // Return non-R3F UI components
  return (
    <div className="z-50 mx-auto flex flex-col items-center w-full">
      <div className="flex flex-col items-center w-screen mx-auto">
        <div className="flex justify-center items-center gap-6 w-full">
          <button
            onClick={() => handleNavigation("previous")}
            className="text-xl font-bold text-center hover:text-primary/70 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-center">{scene.title}</h2>
          <button
            onClick={() => handleNavigation("next")}
            className="text-xl font-bold text-center hover:text-primary/70 transition-colors"
          >
            <ArrowRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      {!showCarousel && scene.body && (
        <div className="fixed right-0 top-0 h-screen w-full max-w-md px-4 flex items-center">
          <div className="w-full">
            <PortableTextRenderer value={scene.body} />
          </div>
        </div>
      )}
      {showCarousel && <Carousel3 scene={scene} selectedPoi={selectedPoi} />}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8">
        <Button
          onClick={(e) => {
            e.preventDefault(); // Prevent immediate navigation
            handleReset();
            setTimeout(() => {
              router.push("/experience");
            }, 100);
          }}
        >
          Back to Main
        </Button>
      </div>
    </div>
  );
}
