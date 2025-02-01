"use client";
import { useEffect } from "react";
import { useR3F } from "@/experience/providers/R3FContext";
import SubScene from "./SubScene";
import { Carousel3 } from "@/components/ui/carousel/carousel-3";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { PointOfInterest } from "./components/SubSceneMarkers";
import { Vector3 } from "three";

export default function SubSceneUI({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();
  const selectedPoi = useCameraStore((state) => state.selectedPoi);
  const setSelectedPoi = useCameraStore((state) => state.setSelectedPoi);

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
    <div className="fixed right-0 top-12 p-4 max-w-lg z-50">
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl font-bold">{scene.title}</h2>
        <Carousel3 scene={scene} selectedPoi={selectedPoi} />
      </div>
    </div>
  );
}
