'use client';
import { CustomCursor } from '@/components/ui/Cursor';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { Leva } from 'leva';
import LandingWrapper from './LandingWrapper';

interface LandingPageProps {
  textureVideo: Sanity.Media;
  modalVideo: Sanity.Media;
}

export default function LandingPage({ textureVideo, modalVideo }: LandingPageProps) {
  const portalRef = {
    current: typeof document !== 'undefined' ? document.getElementById('modal-portal') : null,
  };

  return (
    <R3FProvider>
      <CustomCursor />
      <LandingWrapper
        textureVideo={textureVideo}
        modalVideo={modalVideo}
        portalRef={portalRef as any}
      />

      <Leva hidden={process.env.NEXT_PUBLIC_SITE_ENV === 'production'} />
    </R3FProvider>
  );
}
