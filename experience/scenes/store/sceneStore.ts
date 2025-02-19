import { create } from "zustand";

interface SceneStore {
  modelRotation: number;
  isTransitioning: boolean;
  opacity: number;
  poiActive: boolean;
  setModelRotation: (rotation: number) => void;
  startTransitionOut: () => Promise<void>;
  startTransitionIn: () => Promise<void>;
  setPOIActive: (poiActive: boolean) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  modelRotation: 0,
  isTransitioning: false,
  opacity: 1,
  poiActive: false,

  setModelRotation: (rotation) => {
    set({ modelRotation: rotation });
  },

  setPOIActive: (active) => {
    set({ poiActive: active });
  },

  startTransitionOut: () => {
    set({ isTransitioning: true });
    return new Promise((resolve) => {
      const startTime = Date.now();
      const duration = 300;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          const rotation = progress * Math.PI * 2;
          const opacity = 1 - progress;
          set({ modelRotation: rotation, opacity });
          requestAnimationFrame(animate);
        } else {
          set({ modelRotation: 0, opacity: 0, isTransitioning: false });
          resolve();
        }
      };

      animate();
    });
  },

  startTransitionIn: () => {
    set({ isTransitioning: true });
    return new Promise((resolve) => {
      const startTime = Date.now();
      const duration = 800;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          const rotation = progress * Math.PI * 2;
          const opacity = progress;
          set({ modelRotation: rotation, opacity });
          requestAnimationFrame(animate);
        } else {
          set({ modelRotation: 0, opacity: 1, isTransitioning: false });
          resolve();
        }
      };

      animate();
    });
  },
}));
