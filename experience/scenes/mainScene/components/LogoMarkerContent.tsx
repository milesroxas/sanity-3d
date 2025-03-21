"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useLogoMarkerStore } from "@/experience/scenes/store/logoMarkerStore";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function LogoMarkerContent() {
  const { 
    selectedScene, 
    isContentVisible, 
    setContentVisible, 
    setShouldAnimateBack,
    setOtherMarkersVisible 
  } = useLogoMarkerStore();

  const handleClose = () => {
    // First fade out the content
    setContentVisible(false);
    
    // Start fading in the markers
    setOtherMarkersVisible(true);
    
    // Then trigger camera animation after a short delay to allow fade out
    setTimeout(() => {
      setShouldAnimateBack(true);
    }, 800); // Match the fade out duration
  };

  if (!selectedScene) return null;

  return (
    <AnimatePresence mode="wait">
      {isContentVisible && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="fixed z-20 top-1/2 -translate-y-1/2 left-8 w-full max-w-sm px-4 flex items-center"
        >
          <div className="w-full bg-white/80 backdrop-blur-sm p-6 rounded-lg min-h-[60vh]">
            <div className="flex justify-between items-start mb-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleClose}
                className="absolute top-[-1rem] left-[-1rem]"
              >
                <X className="h-4 w-4" />
              </Button>

              <h2 className="text-xl font-bold text-secondary">{selectedScene.title}</h2>
            </div>
            {selectedScene.body && (
              <div className="text-secondary">
                <PortableTextRenderer value={selectedScene.body} />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 