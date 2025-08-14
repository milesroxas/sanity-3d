'use client';

import { useR3F } from '@/experience/providers/R3FContext';
import { useEffect, useMemo, useRef } from 'react';
import LandingScene from './LandingScene';
import { useLandingCameraStore } from './store/landingCameraStore';

interface LandingWrapperProps {
  textureVideo: Sanity.Media;
  children?: React.ReactNode;
}

export default function LandingWrapper({ children, textureVideo }: LandingWrapperProps) {
  const { setR3FContent } = useR3F();
  const { setCamera, setAnimating, reset, setHasAnimated } = useLandingCameraStore();
  const hasInitializedRef = useRef(false);

  // Memoize the landing scene component with stable props
  const landingSceneComponent = useMemo(() => {
    return <LandingScene textureVideo={textureVideo?.video} />;
  }, [textureVideo?.video]);

  // Setup and cleanup effect
  useEffect(() => {
    // Only initialize once
    if (!hasInitializedRef.current) {
      // Initialize camera state
      setCamera(
        useLandingCameraStore.getState().position.clone(),
        useLandingCameraStore.getState().target.clone()
      );
      setAnimating(false);

      hasInitializedRef.current = true;
    }

    // Set the 3D content
    setR3FContent(landingSceneComponent);

    // Cleanup function
    return () => {
      // Clear the 3D content
      setR3FContent(null);

      // Reset camera position and target, but preserve hasAnimated state
      // This ensures content is visible when navigating back
      const currentState = useLandingCameraStore.getState();
      const hasAnimatedValue = currentState.hasAnimated;

      reset();

      // Restore hasAnimated value after reset
      if (hasAnimatedValue) {
        useLandingCameraStore.setState({ hasAnimated: true });
      }

      hasInitializedRef.current = false;
    };
  }, [setR3FContent, setCamera, setAnimating, reset, landingSceneComponent]);

  return (
    <div className="pointer-events-none absolute inset-0 h-screen w-screen">
      <div className="container mx-auto flex h-full items-center px-4">
        <div className="pointer-events-auto">{children}</div>
      </div>
    </div>
  );
}
