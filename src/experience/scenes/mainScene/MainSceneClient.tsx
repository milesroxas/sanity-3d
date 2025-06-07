'use client';
import { useR3F } from '@/experience/providers/R3FContext';
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import LogoMarkerContent from './components/LogoMarkerContent';
import MainScene from './MainScene';
// Style to prevent scrollbars
const noScrollStyles = {
  height: '100%',
  width: '100%',
};

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { selectedScene, setSelectedScene } = useLogoMarkerStore();
  const { setR3FContent } = useR3F();
  const [isReady, setIsReady] = useState(false);
  const { resetToInitial, isLoading } = useCameraStore();

  useEffect(() => {
    setIsReady(false);
    setSelectedScene(null);

    const timer = setTimeout(
      () => {
        setR3FContent(<MainScene scene={scene} />);
        setIsReady(true);

        // Only call resetToInitial if we're not already in a loading state
        // This prevents double camera reset when coming from landing page
        if (!isLoading) {
          resetToInitial();
        }
      },
      100 // Consistent delay for state propagation
    );

    // Cleanup when unmounting
    return () => {
      clearTimeout(timer);
      setR3FContent(null);
      setSelectedScene(null);

      // Only reset on unmount if we're not in loading state
      if (!isLoading) {
        resetToInitial();
      }
    };
  }, [setR3FContent, setSelectedScene, resetToInitial, isLoading, scene]);

  return (
    <div style={noScrollStyles}>
      <AnimatePresence>
        {!isReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              zIndex: 1000,
            }}
          />
        )}
      </AnimatePresence>

      {/* Logo marker content: Render only when ready and a scene is selected */}
      <AnimatePresence>
        {isReady && selectedScene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LogoMarkerContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
