'use client';

import { useR3F } from '@/experience/providers/R3FContext';
import { useEffect } from 'react';
import LandingScene from './LandingScene';
import { useLandingCameraStore } from './store/landingCameraStore';

export default function LandingWrapper({ children }: { children?: React.ReactNode }) {
  const { setR3FContent } = useR3F();
  const resetLandingCamera = useLandingCameraStore(state => state.reset);

  useEffect(() => {
    // Reset landing camera
    resetLandingCamera();

    // Set R3F content
    setR3FContent(<LandingScene />);

    // Cleanup when unmounting
    return () => {
      setR3FContent(null);
    };
  }, [setR3FContent, resetLandingCamera]);

  // Return the HTML content that should be displayed alongside the 3D scene
  return (
    <div className="pointer-events-none absolute inset-0 z-50 h-screen w-screen">
      <div className="container mx-auto flex h-full items-center px-4">
        <div className="pointer-events-auto">{children}</div>
      </div>
    </div>
  );
}
