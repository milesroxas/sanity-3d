"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import MainScene from "@/experience/scenes/mainScene/MainScene";
import { useEffect } from "react";
import { useCameraStore } from "../store/cameraStore";
import LogoMarkerContent from "./components/LogoMarkerContent";
import { useLogoMarkerStore } from "../store/logoMarkerStore";

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();
  const setIsLoading = useCameraStore((state) => state.setIsLoading);
  const reset = useLogoMarkerStore((state) => state.reset);

  useEffect(() => {
    // Reset the logo marker store when component mounts
    reset();
    
    // Set loading state when component mounts
    setIsLoading(true);

    setR3FContent(
      <MainScene
        scene={scene}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    );

    return () => {
      setR3FContent(null);
      setIsLoading(false);
    };
  }, [setR3FContent, scene, setIsLoading, reset]);

  return (
    <>
      <LogoMarkerContent />
    </>
  );
}
