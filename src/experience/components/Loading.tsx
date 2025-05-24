'use client';
import { INITIAL_POSITIONS, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

export function Loading() {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const progressBarRef = useRef(null);

  const { setIsLoading } = useCameraStore();
  const { setOtherMarkersVisible } = useLogoMarkerStore();

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
      delay: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        setIsVisible(false);
        // Add a slight delay before setting isLoading to false
        // This ensures the camera transition has time to initialize in production
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      },
    });
  }, [setIsLoading, setIsVisible]);

  useEffect(() => {
    // Simple implementation: show when active, hide when not
    if (active && !isVisible) {
      setIsLoading(true);
      setIsVisible(true);
      // Set initial opacity for logo immediately
      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 1 });
      }
      animateIn();
    }

    // Handle fade out when loading is complete
    if (!active && isVisible) {
      // First trigger the camera transition, THEN start fade out
      const cameraStore = useCameraStore.getState();

      cameraStore.setCamera(
        INITIAL_POSITIONS.mainIntro.position.clone(),
        INITIAL_POSITIONS.mainIntro.target.clone(),
        'main'
      );

      // Start the transition immediately
      cameraStore.startCameraTransition(
        INITIAL_POSITIONS.mainIntro.position,
        INITIAL_POSITIONS.main.position,
        INITIAL_POSITIONS.mainIntro.target,
        INITIAL_POSITIONS.main.target
      );

      // Now fade out the loading screen
      animateOut();
    }

    // Cleanup function
    return () => {
      // Kill any running animations
      gsap.killTweensOf([
        containerRef.current,
        logoRef.current,
        textRef.current,
        progressBarRef.current,
      ]);
    };
  }, [active, isVisible, animateIn, animateOut, setOtherMarkersVisible]);

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
          Loading...({Math.round(progress)}%)
        </p>
        <div
          ref={progressBarRef}
          className="h-4 w-full overflow-hidden rounded-full bg-[#216020]"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <div
            className={`h-full bg-[#80DA7E] transition-all duration-300 ease-out ${!active ? 'bg-green-300' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
