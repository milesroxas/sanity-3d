'use client';
import { CustomCursor } from '@/components/ui/Cursor';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { Leva } from 'leva';
import LandingWrapper from './LandingWrapper';
import FullscreenVideoModal from './components/VideoModal';

interface LandingPageProps {
  textureVideo: Sanity.Media;
  modalVideo: Sanity.Media;
}

export default function LandingPage({ textureVideo, modalVideo }: LandingPageProps) {
  return (
    <>
      <R3FProvider>
        <CustomCursor />
        <LandingWrapper textureVideo={textureVideo} modalVideo={modalVideo} />

        <Leva hidden={process.env.NEXT_PUBLIC_SITE_ENV === 'production'} />
      </R3FProvider>

      {/* Render the video modal outside of R3F context */}
      <FullscreenVideoModal />
    </>
  );
}
