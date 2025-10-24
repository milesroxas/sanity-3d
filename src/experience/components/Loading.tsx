'use client';

import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useGSAP } from '@gsap/react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

export function Loading() {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  const hasAnimatedInRef = useRef(false);
  const hasAnimatedOutRef = useRef(false);

  const displayRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const lastTextUpdateRef = useRef(0);

  const { setIsLoading } = useCameraStore();
  const setOtherMarkersVisible = useLogoMarkerStore(s => s.setOtherMarkersVisible);

  // Hide other markers when loader is active
  useEffect(() => {
    if (active) setOtherMarkersVisible(false);
  }, [active, setOtherMarkersVisible]);

  /**
   * Establish a GSAP scope tied to containerRef.
   * All animations created inside this hook are reverted automatically on unmount or scope change.
   */
  const { contextSafe } = useGSAP(
    () => {
      // Optional initial state
      if (containerRef.current) gsap.set(containerRef.current, { opacity: 0 });
      if (textRef.current) gsap.set(textRef.current, { opacity: 0 });
      if (progressBarRef.current) gsap.set(progressBarRef.current, { opacity: 0 });
      if (logoRef.current) gsap.set(logoRef.current, { opacity: 1 });
    },
    { scope: containerRef }
  );

  /**
   * Animate In and Out wrapped with contextSafe.
   * This ensures timelines are bound to the current GSAP context and cleaned up reliably.
   */
  const animateIn = contextSafe(() => {
    if (!containerRef.current) return;

    return gsap
      .timeline()
      .to(containerRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      })
      .to(
        textRef.current,
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        progressBarRef.current,
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.2'
      );
  });

  const animateOut = contextSafe(() => {
    if (!containerRef.current) return;

    return gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsVisible(false);
        requestAnimationFrame(() => setIsLoading(false));
      },
    });
  });

  /**
   * Handle visibility and one-time in/out transitions.
   * This effect only decides when to call the GSAP animations.
   */
  useEffect(() => {
    if (active) {
      if (!hasAnimatedInRef.current) {
        hasAnimatedOutRef.current = false;
        hasAnimatedInRef.current = true;

        setIsLoading(true);
        setIsVisible(true);

        // Reset smoothing state for a new load session
        displayRef.current = 0;
        targetRef.current = 0;
        setDisplayProgress(0);

        animateIn();
      }
    } else {
      if (isVisible && !hasAnimatedOutRef.current) {
        hasAnimatedOutRef.current = true;
        hasAnimatedInRef.current = false;
        animateOut();
      }
    }
    // No manual gsap.killTweensOf needed; useGSAP handles cleanup
  }, [active, isVisible, animateIn, animateOut, setIsLoading]);

  /**
   * Monotonic target update from drei's progress.
   */
  useEffect(() => {
    const liveTarget = Math.min(active ? Math.min(progress, 99.5) : 100, 100);
    targetRef.current = Math.max(targetRef.current, liveTarget);
  }, [progress, active]);

  /**
   * RAF-driven EMA smoothing toward target.
   */
  useEffect(() => {
    if (rafRef.current != null) return;

    lastTsRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const tick = (ts: number) => {
      const now = ts ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const dt = Math.min(0.1, Math.max(0, (now - lastTsRef.current) / 1000));
      lastTsRef.current = now;

      const target = targetRef.current;
      let current = displayRef.current;

      const tau = active ? 0.28 : 0.12;
      const alpha = 1 - Math.exp(-dt / tau);
      current = current + (target - current) * alpha;

      if (Math.abs(target - current) < 0.05) current = target;

      displayRef.current = current;

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${current}%`;
      }

      if (now - lastTextUpdateRef.current > 80 || Math.abs(displayProgress - current) > 0.25) {
        lastTextUpdateRef.current = now;
        setDisplayProgress(current);
      }

      if (active || current < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [active, displayProgress]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="container flex flex-col items-center gap-12">
        <div ref={logoRef} style={{ opacity: 1 }}>
          <Image
            src="/images/logo.webp"
            alt="logo"
            width={100}
            height={100}
            priority
            style={{ width: '100px', height: '100px' }}
          />
        </div>

        <p
          ref={textRef}
          className="text-xl font-medium text-primary"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          Loading...({Math.round(displayProgress)}%)
        </p>

        <div
          ref={progressBarRef}
          className="h-4 w-full overflow-hidden rounded-full bg-[#216020]"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <div
            ref={progressFillRef}
            className={`h-full bg-[#80DA7E] transition-colors ${!active ? 'bg-green-300' : ''}`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
