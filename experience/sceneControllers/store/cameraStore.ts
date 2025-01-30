import { create } from "zustand";
import { Vector3 } from "three";

type CameraState = "main" | "previous" | "current" | "subscene";

interface CameraStore {
  position: Vector3;
  target: Vector3;
  previousPosition: Vector3 | null;
  previousTarget: Vector3 | null;
  controlType: "Map" | "CameraControls" | "Disabled";
  isAnimating: boolean;
  state: CameraState;
  isSubscene: boolean;

  // Actions
  setCamera: (position: Vector3, target: Vector3, state?: CameraState) => void;
  setPreviousCamera: (position: Vector3, target: Vector3) => void;
  restorePreviousCamera: () => void;
  setControlType: (type: "Map" | "CameraControls" | "Disabled") => void;
  setIsAnimating: (state: boolean) => void;
  setIsSubscene: (state: boolean) => void;
  resetToInitial: () => void;
  startCameraTransition: (
    startPos: Vector3,
    endPos: Vector3,
    startTarget: Vector3,
    endTarget: Vector3
  ) => void;
}

export const INITIAL_POSITIONS = {
  main: {
    position: new Vector3(-10, 60, 200),
    target: new Vector3(-10, 10, 50),
  },
  subscene: {
    position: new Vector3(0, 5, 10),
    target: new Vector3(0, 0, 0),
  },
} as const;

export const useCameraStore = create<CameraStore>((set, get) => ({
  position: INITIAL_POSITIONS.main.position.clone(),
  target: INITIAL_POSITIONS.main.target.clone(),
  previousPosition: null,
  previousTarget: null,
  controlType: "Map",
  isAnimating: false,
  state: "main",
  isSubscene: false,

  resetToInitial: () => {
    const initial = INITIAL_POSITIONS[get().isSubscene ? "subscene" : "main"];
    set({
      position: initial.position.clone(),
      target: initial.target.clone(),
      isAnimating: false,
      controlType: get().isSubscene ? "CameraControls" : "Map",
    });
  },

  setPreviousCamera: (position, target) =>
    set({
      previousPosition: position.clone(),
      previousTarget: target.clone(),
    }),

  restorePreviousCamera: () => {
    const { previousPosition, previousTarget } = get();
    if (previousPosition && previousTarget) {
      set({
        position: previousPosition.clone(),
        target: previousTarget.clone(),
        previousPosition: null,
        previousTarget: null,
        controlType: "Map",
        isAnimating: false,
        isSubscene: false,
      });
    } else {
      set({
        position: INITIAL_POSITIONS.main.position.clone(),
        target: INITIAL_POSITIONS.main.target.clone(),
        controlType: "Map",
        isAnimating: false,
        isSubscene: false,
      });
    }
  },

  setCamera: (position, target, state = "current") =>
    set((prev) => {
      // If state is "subscene", use subscene initial positions
      if (state === "subscene") {
        return {
          position: INITIAL_POSITIONS.subscene.position.clone(),
          target: INITIAL_POSITIONS.subscene.target.clone(),
          isAnimating: false,
          state,
          isSubscene: true,
          controlType: "CameraControls",
        };
      }

      // Otherwise use provided position/target
      return {
        position: position.clone(),
        target: target.clone(),
        isAnimating: true,
        state,
      };
    }),
  setIsSubscene: (isSubscene) => set({ isSubscene }),
  setControlType: (controlType) => set({ controlType }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  startCameraTransition: (startPos, endPos, startTarget, endTarget) => {
    set({
      controlType: "Disabled",
      isAnimating: true,
    });

    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const t =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newPosition = new Vector3().lerpVectors(startPos, endPos, t);
      const newTarget = new Vector3().lerpVectors(startTarget, endTarget, t);

      set({ position: newPosition, target: newTarget });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        set({ isAnimating: false });
      }
    };

    animate();
  },
}));
