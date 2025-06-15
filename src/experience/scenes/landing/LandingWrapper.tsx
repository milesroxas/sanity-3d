'use client';

import { useR3F } from '@/experience/providers/R3FContext';
import { SanityNav, SanitySettings } from '@/store/navStore';
import { useEffect } from 'react';
import LandingScene from './LandingScene';
import { useLandingCameraStore } from './store/landingCameraStore';

interface LandingWrapperProps {
  textureVideo: Sanity.Media;
  modalVideo: Sanity.Media;
  portalRef: any;
  children?: React.ReactNode;
  nav: SanityNav;
  settings: SanitySettings;
}

export default function LandingWrapper({
  children,
  textureVideo,
  modalVideo,
  portalRef,
  nav,
  settings,
}: LandingWrapperProps) {
  const { setR3FContent } = useR3F();
  const resetLandingCamera = useLandingCameraStore(state => state.reset);

  useEffect(() => {
    // Reset landing camera
    resetLandingCamera();

    // Set R3F content with both videos
    setR3FContent(
      <LandingScene nav={nav} modalVideo={(modalVideo as any)?.video} portalRef={portalRef} />
    );

    // Cleanup when unmounting
    return () => {
      setR3FContent(null);
    };
  }, [setR3FContent, resetLandingCamera, textureVideo, modalVideo, portalRef]);

  // Return the HTML content that should be displayed alongside the 3D scene
  return (
    <div className="pointer-events-none absolute inset-0 h-screen w-screen">
      <div className="container mx-auto flex h-full items-center px-4">
        <div className="pointer-events-auto">{children}</div>
      </div>
    </div>
  );
}
