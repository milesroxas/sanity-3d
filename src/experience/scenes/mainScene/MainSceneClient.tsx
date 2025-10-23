'use client';

import { useR3F } from '@/experience/providers/R3FContext';
import {
  selectBeginIntroTransition,
  selectFirstTimeLoading,
  selectIntroPhase,
  selectIsAnimating,
  selectIsLoading,
  selectResetToInitial,
  selectSetIsLoading,
  useCameraStore,
} from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import IntroOverlay from './components/IntroOverlay';
import LogoMarkerContent from './components/LogoMarkerContent';
import MainScene from './MainScene';

const noScrollStyles = {
  height: '100%',
  width: '100%',
};

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const selectedScene = useLogoMarkerStore(s => s.selectedScene);
  const setSelectedScene = useLogoMarkerStore(s => s.setSelectedScene);
  const { setR3FContent } = useR3F();

  // Performance optimization: Use selectors to prevent re-renders during camera animation
  // This prevents 360 unnecessary re-renders during the 6-second intro (60fps × 6s)
  const resetToInitial = useCameraStore(selectResetToInitial);
  const isLoading = useCameraStore(selectIsLoading);
  const setIsLoading = useCameraStore(selectSetIsLoading);
  const introPhase = useCameraStore(selectIntroPhase);
  const firstTimeLoading = useCameraStore(selectFirstTimeLoading);
  const beginIntroTransition = useCameraStore(selectBeginIntroTransition);
  const isAnimating = useCameraStore(selectIsAnimating);

  const memoizedScene = useMemo(() => scene, [scene._id]);

  useLayoutEffect(() => {
    // Reset camera to intro position and clear any selected scene
    resetToInitial();
    setSelectedScene(null);

    // Set the R3F content
    setR3FContent(<MainScene scene={memoizedScene} />);

    // Cleanup when unmounting
    return () => {
      setR3FContent(null);
      setSelectedScene(null);
    };
  }, [setR3FContent, setSelectedScene, resetToInitial, memoizedScene]);

  // Show IntroOverlay only after assets are loaded and during intro/transition phases
  const showIntroOverlay =
    firstTimeLoading && !isLoading && (introPhase === 'intro' || introPhase === 'transition');

  // Show LogoMarkerContent when a scene is selected
  const showLogoMarkerContent = selectedScene !== null;

  // Returning visits can bypass the loader, so clear loading state once we're back on the experience page
  useEffect(() => {
    if (!firstTimeLoading && isLoading) {
      const frame = requestAnimationFrame(() => setIsLoading(false));
      return () => cancelAnimationFrame(frame);
    }
  }, [firstTimeLoading, isLoading, setIsLoading]);

  // Automatically replay the intro transition on return visits so the camera animates into place
  useEffect(() => {
    if (!firstTimeLoading && !isLoading && !isAnimating && introPhase === 'intro') {
      beginIntroTransition();
    }
  }, [beginIntroTransition, firstTimeLoading, introPhase, isAnimating, isLoading]);

  return (
    <div>
      <div style={noScrollStyles}>
        {showIntroOverlay && <IntroOverlay />}
        {showLogoMarkerContent && <LogoMarkerContent />}
      </div>
    </div>
  );
}
