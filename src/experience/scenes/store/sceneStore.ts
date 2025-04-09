import { create } from 'zustand';

interface SceneStore {
  isTransitioning: boolean;
  opacity: number;
  initialRevealComplete: boolean;
  isInitialReveal: boolean;
  startInitialReveal: () => Promise<void>;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

export const useSceneStore = create<SceneStore>(set => ({
  isTransitioning: false,
  opacity: 1,
  initialRevealComplete: false,
  isInitialReveal: true,

  setIsTransitioning: isTransitioning => {
    set({ isTransitioning });
  },

  startInitialReveal: () => {
    set({ isInitialReveal: true, opacity: 1 });
    return new Promise(resolve => {
      const startTime = Date.now();
      const duration = 2000;
      let animationFrameId: number;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          set({ opacity: 1 - progress });
          animationFrameId = requestAnimationFrame(animate);
        } else {
          set({
            opacity: 0,
            isInitialReveal: false,
          });
          resolve();
        }
      };

      animate();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        set({ isInitialReveal: false });
        resolve();
      };
    });
  },
}));
