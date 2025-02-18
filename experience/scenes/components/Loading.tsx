"use client";
import { useCameraStore } from "../store/cameraStore";
import { useSceneStore } from "../store/sceneStore";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Loading() {
  const { isLoading } = useCameraStore();
  const { isTransitioning } = useSceneStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (isLoading || isTransitioning) {
      // Only show loading if state persists for more than 1 second
      showTimer = setTimeout(() => setShow(true), 1000);
    } else {
      hideTimer = setTimeout(() => setShow(false), 300);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading, isTransitioning]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-none"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-xl font-medium">Loading...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
