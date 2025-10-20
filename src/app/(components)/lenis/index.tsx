'use client';

import { useScrollLockStore } from '@/lib/store';
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
  const isScrollLocked = useScrollLockStore(state => state.isScrollLocked);

  // Stop/start Lenis and compensate for scrollbar width to prevent layout shift
  useEffect(() => {
    if (!lenis) return;

    if (isScrollLocked) {
      // Calculate scrollbar width before it disappears
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      lenis.stop();

      // Add padding to compensate for missing scrollbar
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        // Also apply to fixed header to prevent shift
        const header = document.querySelector('header.fixed');
        if (header instanceof HTMLElement) {
          header.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
    } else {
      lenis.start();
      document.body.style.paddingRight = '';

      // Remove padding from fixed header
      const header = document.querySelector('header.fixed');
      if (header instanceof HTMLElement) {
        header.style.paddingRight = '';
      }
    }
  }, [isScrollLocked, lenis]);

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
