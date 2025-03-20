"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useLogoMarkerStore } from "@/experience/scenes/store/logoMarkerStore";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function LogoMarkerContent() {
  const { selectedScene, isContentVisible, setContentVisible, setShouldAnimateBack } = useLogoMarkerStore();

  const handleClose = () => {
    // First fade out the content
    setContentVisible(false);
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
          transition={{ duration: 0.8 }}
          className="fixed z-20 top-1/2 -translate-y-1/2 right-8 w-full max-w-md px-4 flex items-center"
        >
          <div className="w-full bg-black/50 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">{selectedScene.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white hover:text-white/70"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {selectedScene.body && (
              <div className="text-white">
                <PortableTextRenderer value={selectedScene.body} />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 