// components/scroll-trigger.tsx
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { useEffect, useLayoutEffect, useRef } from 'react';

export function ScrollTriggerConfig() {
  // Flag to ensure we only register once
  const initialized = useRef(false);

  // Register plugins and setup global config on mount
  useLayoutEffect(() => {
    // Only run once
    if (initialized.current) return;
    initialized.current = true;

    // Register ScrollTrigger plugin globally
    gsap.registerPlugin(ScrollTrigger);

    // Basic global settings that apply to all ScrollTriggers
    ScrollTrigger.config({
      ignoreMobileResize: true, // Better mobile performance
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load', // Don't trigger too many refreshes
    });

    // Create a global refresh listener for handling layout changes
    window.addEventListener('scroll-refresh', () => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener('scroll-refresh', () => {
        ScrollTrigger.refresh();
      });
    };
  }, []);

  // Lenis smooth scroll integration
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Create persistent handler references
    const scrollHandler = () => {
      ScrollTrigger.update();
    };

    const tickHandler = (time: number) => {
      if (lenis) {
        lenis.raf(time * 1000);
      }
    };

    // Connect to Lenis
    lenis.on('scroll', scrollHandler);
    gsap.ticker.add(tickHandler);

    // Initial refresh
    ScrollTrigger.refresh();

    return () => {
      // Clean up event listeners
      if (lenis) {
        lenis.off('scroll', scrollHandler);
      }
      gsap.ticker.remove(tickHandler);
    };
  }, [lenis]);

  return null;
}
