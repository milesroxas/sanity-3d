"use client";
import { useEffect } from "react";
import { useR3F } from "@/experience/providers/R3FContext";
import SubScene from "./SubScene";
import { Carousel3 } from "@/components/ui/carousel/carousel-3";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { PointOfInterest } from "./components/SubSceneMarkers";
import { Vector3 } from "three";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SubSceneUI({ scene }: { scene: Sanity.Scene }) {
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

  // Filter valid points of interest
  const validPointsOfInterest = (scene.pointsOfInterest ?? []).filter(
    (poi): poi is PointOfInterest => (poi as any).markerPosition !== undefined
  );

  const handleSlideChange = (poi: PointOfInterest) => {
    if (poi.cameraPosition && poi.cameraTarget) {
      const { setControlType, startCameraTransition, position, target } =
        useCameraStore.getState();
      setControlType("Disabled");
      startCameraTransition(
        position,
        new Vector3(
          poi.cameraPosition.x,
          poi.cameraPosition.y,
          poi.cameraPosition.z
        ),
        target,
        new Vector3(poi.cameraTarget.x, poi.cameraTarget.y, poi.cameraTarget.z)
      );
      setSelectedPoi(poi);
    }
  };

  useEffect(() => {
    console.log("SubSceneUI mount effect");
    setR3FContent(
      <SubScene scene={scene} onMarkerClick={(poi) => setSelectedPoi(poi)} />
    );
    return () => {
      console.log("SubSceneUI cleanup effect");
      useCameraStore.getState().restorePreviousCamera();
      useCameraStore.getState().setIsSubscene(false);
      useCameraStore.getState().setIsLoading(false);
      setR3FContent(null);
    };
  }, [setR3FContent, scene, setSelectedPoi]);

  // Return non-R3F UI components
  return (
    <div className="relative w-full p-4 z-50">
      <div className="container mx-auto">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleNavigation("previous")}
            className="text-xl font-bold text-center mb-12 hover:text-primary/70 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-center mb-12">{scene.title}</h2>
          <button
            onClick={() => handleNavigation("next")}
            className="text-xl font-bold text-center mb-12 hover:text-primary/70 transition-colors"
          >
            <ArrowRightIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-8">
          <Carousel3 scene={scene} selectedPoi={selectedPoi} />
        </div>
      </div>
    </div>
  );
}
