import { create } from "zustand";
import { useCameraStore } from "../store/cameraStore";

interface SceneStore {
  modelRotation: number;
  isTransitioning: boolean;
  setModelRotation: (rotation: number) => void;
  startTransitionOut: () => Promise<void>;
  startTransitionIn: () => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  modelRotation: 0,
  isTransitioning: false,

  setModelRotation: (rotation) => {
    console.log("🎯 setModelRotation:", (rotation * 180) / Math.PI);
    set({ modelRotation: rotation });
  },

  startTransitionOut: () => {
    console.log("🔄 Starting transition out", {
      cameraState: {
        position: useCameraStore.getState().position.toArray(),
        isAnimating: useCameraStore.getState().isAnimating,
        isSubscene: useCameraStore.getState().isSubscene,
      },
    });
    set({ isTransitioning: true });
    return new Promise((resolve) => {
      const startTime = Date.now();
      const duration = 800;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          const rotation = progress * Math.PI * 2; // Full 360 degrees (2π)

          set({ modelRotation: rotation });
          requestAnimationFrame(animate);
        } else {
          console.log("✅ Transition out complete");
          set({ modelRotation: 0 }); // Reset to 0
          set({ isTransitioning: false });
          resolve();
        }
      };

      animate();
    });
  },

  startTransitionIn: () => {
    console.log("🔄 Starting transition in", {
      cameraState: {
        position: useCameraStore.getState().position.toArray(),
        isAnimating: useCameraStore.getState().isAnimating,
        isSubscene: useCameraStore.getState().isSubscene,
      },
    });
    set({ isTransitioning: true });
    const startTime = Date.now();
    const duration = 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        const rotation = progress * Math.PI * 2; // Full 360 degrees (2π)
        set({ modelRotation: rotation });
        requestAnimationFrame(animate);
      } else {
        console.log("✅ Transition in complete");
        set({ modelRotation: 0, isTransitioning: false });
      }
    };

    animate();
  },
}));
