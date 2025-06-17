'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useLenis } from 'lenis/react';
import { useEffect, useLayoutEffect } from 'react';

export function ScrollTriggerConfig() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.clearScrollMemory('manual');
    ScrollTrigger.defaults({
      markers: process.env.NEXT_PUBLIC_SITE_ENV !== 'production',
    });
  }, []);

  const lenis = useLenis(ScrollTrigger.update);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => ScrollTrigger.refresh(), [lenis]);

  return null;
}
