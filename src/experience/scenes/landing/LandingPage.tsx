'use client';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { SanityNav, SanitySettings } from '@/store/navStore';
import { Leva } from 'leva';
import LandingWrapper from './LandingWrapper';

interface LandingPageProps {
  textureVideo: Sanity.Media;
  modalVideo: Sanity.Media;
  nav: SanityNav;
  settings: SanitySettings;
}

export default function LandingPage({ textureVideo, modalVideo, nav, settings }: LandingPageProps) {
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
        nav={nav}
        settings={settings}
      />

      {/* Hide Leva in production, show in development */}
      <Leva hidden={process.env.NEXT_PUBLIC_SITE_ENV === 'production'} />
    </R3FProvider>
  );
}
