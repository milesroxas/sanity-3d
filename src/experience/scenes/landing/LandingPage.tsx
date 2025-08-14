'use client';
import { CustomCursor } from '@/components/ui/Cursor';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { Leva } from 'leva';
import { useEffect, useRef } from 'react';
import LandingWrapper from './LandingWrapper';

interface LandingPageProps {
  textureVideo: Sanity.Media;
  modalVideo: Sanity.Media;
}

export default function LandingPage({ textureVideo, modalVideo }: LandingPageProps) {
  const portalRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      portalRef.current = document.getElementById('modal-portal');
    }
  }, []);

  return (
    <R3FProvider>
      <CustomCursor />
      <LandingWrapper textureVideo={textureVideo} modalVideo={modalVideo} portalRef={portalRef} />

      <Leva hidden={process.env.NEXT_PUBLIC_SITE_ENV === 'production'} />
    </R3FProvider>
  );
}
