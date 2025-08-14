'use client';
import { CustomCursor } from '@/components/ui/Cursor';
import { R3FProvider } from '@/experience/providers/R3FContext';
import { Leva } from 'leva';
import LandingWrapper from './LandingWrapper';

interface LandingPageProps {
  textureVideo: Sanity.Media;
}

export default function LandingPage({ textureVideo }: LandingPageProps) {
  return (
    <R3FProvider>
      <CustomCursor />
      <LandingWrapper textureVideo={textureVideo} />

      <Leva hidden={process.env.NEXT_PUBLIC_SITE_ENV === 'production'} />
    </R3FProvider>
  );
}
