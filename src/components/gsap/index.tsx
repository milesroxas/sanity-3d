'use client';

import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import Tempus from 'tempus';
import { ScrollTriggerConfig } from './scroll-trigger';

export function GSAP({ scrollTrigger = false }) {
  // Track initialization to ensure we only run once
  const initialized = useRef(false);
  const tempusHandler = useRef<((time: number) => void) | null>(null);

  useLayoutEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Set basic defaults for all animations
    gsap.defaults({
      ease: 'none',
      overwrite: 'auto',
    });

    // Optimize GSAP ticker
    gsap.ticker.lagSmoothing(0);

    // Remove default update to use Tempus instead
    gsap.ticker.remove(gsap.updateRoot);

    // Create handler for Tempus
    tempusHandler.current = (time: number) => {
      gsap.updateRoot(time / 1000);
    };

    // Try to use Tempus for better performance if available
    if (Tempus && typeof Tempus.add === 'function') {
      Tempus.add(tempusHandler.current);
    }

    return () => {
      // Clean up Tempus handler
      if (tempusHandler.current && Tempus && typeof (Tempus as any).remove === 'function') {
        (Tempus as any).remove(tempusHandler.current);
        tempusHandler.current = null;
      }

      // Remove initialization flag when component unmounts
      initialized.current = false;
    };
  }, []);

  // Only include ScrollTrigger config if requested
  return scrollTrigger ? <ScrollTriggerConfig /> : null;
}
