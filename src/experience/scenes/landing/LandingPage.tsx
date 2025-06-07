'use client';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { Leva } from 'leva';
import LandingWrapper from './LandingWrapper';
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'development';

interface LandingPageProps {
  textureVideo: Sanity.Media;
  modalVideo: Sanity.Media;
}

export default function LandingPage({ textureVideo, modalVideo }: LandingPageProps) {
  // Use getElementById instead of a ref
  const portalRef = {
    current: typeof document !== 'undefined' ? document.getElementById('modal-portal') : null,
  };

  return (
    <R3FProvider>
      <LandingWrapper
        textureVideo={textureVideo}
        modalVideo={modalVideo}
        portalRef={portalRef as any}
      />

      {/* Hide Leva in production, show in development */}
      <Leva hidden={isProduction} />
    </R3FProvider>
  );
}
