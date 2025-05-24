import { create } from 'zustand';

interface SceneStore {
  modelRotation: number;
  isTransitioning: boolean;
  opacity: number;
  poiActive: boolean;
  initialRevealComplete: boolean;
  isInitialReveal: boolean;
  setModelRotation: (rotation: number) => void;
  startTransitionOut: () => Promise<void>;
  startTransitionIn: () => Promise<void>;
  setPOIActive: (poiActive: boolean) => void;
  startInitialReveal: () => Promise<void>;
  completeInitialReveal: () => void;
  resetInitialReveal: () => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

export const useSceneStore = create<SceneStore>(set => ({
  modelRotation: 0,
  isTransitioning: false,
  opacity: 1,
  poiActive: false,
  initialRevealComplete: false,
  isInitialReveal: true,

  setModelRotation: rotation => {
    set({ modelRotation: rotation });
  },

  setPOIActive: active => {
    set({ poiActive: active });
  },

  setIsTransitioning: isTransitioning => {
    set({ isTransitioning });
  },

  completeInitialReveal: () => {
    set({ isInitialReveal: false, initialRevealComplete: true });
  },

  resetInitialReveal: () => {
    set({ isInitialReveal: true, initialRevealComplete: false });
  },

  startTransitionOut: () => {
    if (useSceneStore.getState().isTransitioning) {
      return Promise.resolve();
    }

    set({ isTransitioning: true });
    return new Promise(resolve => {
      const startTime = Date.now();
      const duration = 300;
      let animationFrameId: number;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          const rotation = progress * Math.PI * 2;
          const opacity = 1 - progress;
          set({ modelRotation: rotation, opacity });
          animationFrameId = requestAnimationFrame(animate);
        } else {
          set({ modelRotation: 0, opacity: 0, isTransitioning: false });
          resolve();
        }
      };

      animate();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        set({ isTransitioning: false });
        resolve();
      };
    });
  },

  startTransitionIn: () => {
    if (useSceneStore.getState().isTransitioning) {
      return Promise.resolve();
    }

    set({ isTransitioning: true });
    return new Promise(resolve => {
      const startTime = Date.now();
      const duration = 800;
      let animationFrameId: number;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          const rotation = progress * Math.PI * 2;
          const opacity = progress;
          set({ modelRotation: rotation, opacity });
          animationFrameId = requestAnimationFrame(animate);
        } else {
          set({ modelRotation: 0, opacity: 1, isTransitioning: false });
          resolve();
        }
      };

      animate();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        set({ isTransitioning: false });
        resolve();
      };
    });
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
            initialRevealComplete: true,
          });
          resolve();
        }
      };

      animate();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        set({ isInitialReveal: false, initialRevealComplete: true });
        resolve();
      };
    });
  },
}));
