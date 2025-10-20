'use client';
import { R3FProvider } from '@/experience/providers/R3FContext';
import MainSceneClient from '@/experience/scenes/mainScene/MainSceneClient';
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { TransitionProvider } from '@/providers/TransitionProvider';
import { useLenis } from 'lenis/react';
import { Leva } from 'leva';
import { useEffect, useState } from 'react';
import { fetchSanitySceneBySlug } from './actions';

export default function Page() {
  const [scene, setScene] = useState<any>(null);
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';
  const resetCameraStore = useCameraStore(state => state.reset);

  useEffect(() => {
    fetchSanitySceneBySlug({ slug: 'experience' }).then(setScene);
  }, []);

  // Reset stores on mount
  useEffect(() => {
    resetCameraStore();
  }, [resetCameraStore]);

  // Prevent scrolling on experience pages
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }

    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, [lenis]);

  if (!scene) return null;

  return (
    <TransitionProvider overlayClassName="bg-white">
      <R3FProvider>
        <main className="mt-8">
          <MainSceneClient scene={scene} />
        </main>
        <Leva hidden={isProduction} />
      </R3FProvider>
    </TransitionProvider>
  );
}
