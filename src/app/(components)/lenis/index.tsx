'use client';

import { useStore } from '@/lib/store';
import type { LenisOptions } from 'lenis';
import 'lenis/dist/lenis.css';
import type { LenisRef, LenisProps as ReactLenisProps } from 'lenis/react';
import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { useTempus } from 'tempus/react';

interface LenisProps extends Omit<ReactLenisProps, 'ref'> {
  root: boolean;
  options: LenisOptions;
}

// A child component inside ReactLenis so useLenis() is within the provider
function LenisController() {
  const lenis = useLenis();
  const isNavOpened = useStore(state => state.isNavOpened);

  useEffect(() => {
    if (!lenis) return;
    if (isNavOpened) lenis.stop();
    else lenis.start();
  }, [isNavOpened, lenis]);

  return null;
}

export function Lenis({ root, options }: LenisProps) {
  const lenisRef = useRef<LenisRef>(null);

  // Drive Lenis via Tempus RAF
  useTempus((time: number) => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.raf(time);
    }
  });

  return (
    <ReactLenis
      ref={lenisRef}
      root={root}
      options={{
        ...options,
        lerp: options?.lerp ?? 0.125,
        autoRaf: false,
        anchors: true,
        // Prevent Lenis from taking over specific tooling layers
        prevent: (node: Element | null) =>
          node?.nodeName === 'VERCEL-LIVE-FEEDBACK' || node?.id === 'theatrejs-studio-root',
      }}
    >
      <LenisController />
    </ReactLenis>
  );
}
