"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useR3F } from "@/experience/providers/R3FContext";
import SubScene from "./SubScene";
import { Carousel3 } from "@/components/ui/carousel/carousel-3";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { PointOfInterest } from "./components/SubSceneMarkers";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { fetchNavigationScenes } from "@/app/(main)/actions";
import { useSceneStore } from "@/experience/scenes/store/sceneStore";

interface NavigationScene {
  slug?: { current: string };
  title: string;
}

export default function SubSceneUI({ scene }: { scene: Sanity.Scene }) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [validScenes, setValidScenes] = useState<NavigationScene[]>([]);
  const router = useRouter();
  const { setR3FContent } = useR3F();
  const selectedPoi = useCameraStore((state) => state.selectedPoi);
  const setSelectedPoi = useCameraStore((state) => state.setSelectedPoi);

  useEffect(() => {
    // Fetch navigation scenes when component mounts
    const getNavigationScenes = async () => {
      const scenes = await fetchNavigationScenes();
      setValidScenes(scenes);
    };
    getNavigationScenes();
  }, []);

  const handleNavigation = async (direction: "next" | "previous") => {
    const currentSlug = window.location.pathname.split("/").pop();
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

    // Start transition without setting loading state
    await useSceneStore.getState().startTransitionOut();
    const targetUrl = `/experience/${targetScene.slug.current}`;
    router.push(targetUrl);
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

  const currentSlug = window.location.pathname.split("/").pop();
  const currentIndex = validScenes.findIndex(
    (scene) => scene?.slug?.current === currentSlug
  );

  const canNavigatePrevious =
    validScenes.length > 1 && currentIndex < validScenes.length - 1;
  const canNavigateNext = validScenes.length > 1 && currentIndex > 0;

  return (
    <div className="z-50 mx-auto flex flex-col items-center w-full">
      <div className="flex flex-col items-center w-screen mx-auto">
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
      </div>
      <div className="fixed right-8 top-0 h-screen w-full max-w-md px-4 flex items-center">
        {!showCarousel && scene.body && (
          <div className="w-full">
            <PortableTextRenderer value={scene.body} />
          </div>
        )}
        {showCarousel && (
          <Carousel3
            scene={scene}
            selectedPoi={selectedPoi}
            onClose={() => setShowCarousel(false)}
          />
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8">
        <Button
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
      </div>
    </div>
  );
}
