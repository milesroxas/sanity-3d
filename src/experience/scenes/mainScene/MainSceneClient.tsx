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
  const { resetToInitial, isLoading, position } = useCameraStore();

  useEffect(() => {
    // Initialize camera state first before rendering anything
    resetToInitial();

    // Short delay to ensure camera state is initialized
    setTimeout(() => {
      setIsReady(false);
      setSelectedScene(null);

      // Then set the content and make it visible
      setR3FContent(<MainScene scene={scene} />);
      setIsReady(true);
    }, 100);

    // Cleanup when unmounting
    return () => {
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
