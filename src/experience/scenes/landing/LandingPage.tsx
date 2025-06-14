'use client';
import { CustomCursor } from '@/components/ui/Cursor';
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
        nav={nav}
        settings={settings}
      />

      <Leva hidden={process.env.NEXT_PUBLIC_SITE_ENV === 'production'} />
    </R3FProvider>
  );
}
