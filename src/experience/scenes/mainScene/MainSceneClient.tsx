'use client';
import { useR3F } from '@/experience/providers/R3FContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import LogoMarkerContent from './components/LogoMarkerContent';
import MainScene from './MainScene';
// Style to prevent scrollbars
const noScrollStyles = {
  height: '100%',
  width: '100%',
};

export default function MainSceneClient({ scene }: { scene: Sanity.Scene }) {
  const { setR3FContent } = useR3F();

  useEffect(() => {
    setR3FContent(<MainScene scene={scene} />);

    // Cleanup when unmounting
    return () => {
      setR3FContent(null);
    };
  }, [scene, setR3FContent]);

  return (
    <div style={noScrollStyles}>
      <AnimatePresence>
        {
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LogoMarkerContent />
          </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}
