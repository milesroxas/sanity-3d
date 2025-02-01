"use client";
import { useEffect } from "react";
import { useR3F } from "@/experience/providers/R3FContext";
import SubScene from "./SubScene";
import { Carousel3 } from "@/components/ui/carousel/carousel-3";
import { useCameraStore } from "@/experience/sceneControllers/store/cameraStore";

export default function SubSceneUI({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();

  useEffect(() => {
    console.log("SubSceneUI mount effect");
    setR3FContent(<SubScene scene={scene} />);

    return () => {
      console.log("SubSceneUI cleanup effect");
      // Ensure we clean up the previous scene before setting content to null
      useCameraStore.getState().restorePreviousCamera();
      useCameraStore.getState().setIsSubscene(false);
      useCameraStore.getState().setIsLoading(false);
      setR3FContent(null);
    };
  }, [setR3FContent, scene]);

  // Return non-R3F UI components
  return (
    <div className="fixed right-0 top-12 p-4 max-w-lg z-50">
      <div className="flex flex-col gap-4 items-start">
        <h2 className="text-xl font-bold">{scene.title}</h2>
        <Carousel3 pointsOfInterest={scene.pointsOfInterest} />
      </div>
    </div>
  );
}
