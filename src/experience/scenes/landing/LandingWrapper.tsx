'use client';

import { useR3F } from '@/experience/providers/R3FContext';
import { useEffect } from 'react';
import LandingScene from './LandingScene';
import { useLandingCameraStore } from './store/landingCameraStore';

interface LandingWrapperProps {
  textureVideo: Sanity.Media;
  modalVideo: Sanity.Media;
  portalRef: any;
  children?: React.ReactNode;
}

export default function LandingWrapper({
  children,
  textureVideo,
  modalVideo,
  portalRef,
}: LandingWrapperProps) {
  const { setR3FContent } = useR3F();
  const { setCamera, setAnimating } = useLandingCameraStore();

  useEffect(() => {
    setCamera(
      useLandingCameraStore.getState().position.clone(),
      useLandingCameraStore.getState().target.clone()
    );
    setAnimating(false);

    setR3FContent(
      <LandingScene
        modalVideo={(modalVideo as any)?.video}
        textureVideo={(textureVideo as any)?.video}
        portalRef={portalRef}
      />
    );

    return () => {
      setR3FContent(null);
    };
  }, [setR3FContent, setCamera, setAnimating, textureVideo, modalVideo, portalRef]);

  return (
    <div className="pointer-events-none absolute inset-0 h-screen w-screen">
      <div className="container mx-auto flex h-full items-center px-4">
        <div className="pointer-events-auto">{children}</div>
      </div>
    </div>
  );
}
