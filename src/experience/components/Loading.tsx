'use client';
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

export function Loading() {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const progressBarRef = useRef(null);
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

  useEffect(() => {
    if (active) {
      setOtherMarkersVisible(false);
    }
  }, [active, setOtherMarkersVisible]);

  // Using useCallback for stable function references across renders
  const animateIn = useCallback(() => {
    if (!containerRef.current) return;

    // Create a GSAP timeline for better performance
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    })
      .to(
        textRef.current,
        {
          opacity: 1,
          duration: 0.4,
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

    return tl;
  }, []);

  const animateOut = useCallback(() => {
    if (!containerRef.current) return;

    return gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      delay: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        setIsVisible(false);
        // Add a slight delay before setting isLoading to false
        // This ensures the camera transition has time to initialize in production
        requestAnimationFrame(() => setIsLoading(false));
      },
    });
  }, [setIsLoading, setIsVisible]);

  useEffect(() => {
    // Guard against rapid loader state flaps
    if (active) {
      // Only animate in once per load session
      if (!hasAnimatedInRef.current) {
        hasAnimatedOutRef.current = false;
        hasAnimatedInRef.current = true;
        setIsLoading(true);
        setIsVisible(true);
        // Reset smoothed progress for a new loading session
        displayRef.current = 0;
        targetRef.current = 0;
        setDisplayProgress(0);
        if (logoRef.current) {
          gsap.set(logoRef.current, { opacity: 1 });
        }
        // Kill any out tween before animating in
        gsap.killTweensOf(containerRef.current);
        animateIn();
      }
    } else {
      // Only animate out once when loading completes
      if (isVisible && !hasAnimatedOutRef.current) {
        hasAnimatedOutRef.current = true;
        hasAnimatedInRef.current = false;
        animateOut();
      }
    }

    // Cleanup function
    return () => {
      gsap.killTweensOf([
        containerRef.current,
        logoRef.current,
        textRef.current,
        progressBarRef.current,
      ]);
    };
  }, [active, isVisible, animateIn, animateOut]);

  // Update the target progress monotonically (never decreases)
  useEffect(() => {
    // Clamp live target to keep bar meaningful and stable
    const liveTarget = Math.min(active ? Math.min(progress, 99.5) : 100, 100);
    // Never allow the target to move backwards (monotonic)
    targetRef.current = Math.max(targetRef.current, liveTarget);
  }, [progress, active]);

  // RAF-driven smoothing towards the target
  useEffect(() => {
    if (rafRef.current != null) return;

    lastTsRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const tick = (ts: number) => {
      const now = ts ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const dt = Math.min(0.1, Math.max(0, (now - lastTsRef.current) / 1000)); // seconds, clamped
      lastTsRef.current = now;

      const target = targetRef.current;
      let current = displayRef.current;

      // Time-constant smoothing (EMA). Faster when finishing.
      const tau = active ? 0.28 : 0.12; // seconds to cover ~63% of remaining distance
      const alpha = 1 - Math.exp(-dt / tau);
      current = current + (target - current) * alpha;

      // Snap when close to avoid micro-jitter
      if (Math.abs(target - current) < 0.05) current = target;

      displayRef.current = current;

      // Update the DOM width directly for smooth visual updates without frequent re-renders
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${current}%`;
      }

      // Throttle text/state updates to reduce React re-render frequency
      if (now - lastTextUpdateRef.current > 80 || Math.abs(displayProgress - current) > 0.25) {
        lastTextUpdateRef.current = now;
        setDisplayProgress(current);
      }

      // Keep animating while loading is active or we haven't reached 100 yet
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
  }, [active]);

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
