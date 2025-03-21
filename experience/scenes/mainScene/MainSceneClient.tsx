"use client";
import { useR3F } from "@/experience/providers/R3FContext";
import MainScene from "@/experience/scenes/mainScene/MainScene";
import { useEffect } from "react";
import { useCameraStore } from "../store/cameraStore";
import LogoMarkerContent from "./components/LogoMarkerContent";
import { useLogoMarkerStore } from "../store/logoMarkerStore";

// Style to prevent scrollbars
const noScrollStyles = {
  overflow: 'hidden',
  height: '100%',
  width: '100%',
};

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();
  const setIsLoading = useCameraStore((state) => state.setIsLoading);
  const reset = useLogoMarkerStore((state) => state.reset);

  useEffect(() => {
    // Reset the logo marker store when component mounts
    reset();
    
    // Set loading state when component mounts
    setIsLoading(true);

    // Prevent scrollbars from appearing
    document.body.style.overflow = 'hidden';

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
      // Restore default overflow setting
      document.body.style.overflow = '';
    };
  }, [setR3FContent, scene, setIsLoading, reset]);

  return (
    <div style={noScrollStyles}>
      <LogoMarkerContent />
    </div>
  );
}
