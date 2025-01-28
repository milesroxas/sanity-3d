import { create } from "zustand";
import { Vector3 } from "three";

type CameraState = "main" | "previous" | "current" | "subscene";

interface CameraStore {
  position: Vector3;
  target: Vector3;
  controlType: "Map" | "CameraControls" | "Disabled";
  isAnimating: boolean;
  state: CameraState;
  isSubscene: boolean;

  // Actions
  setCamera: (position: Vector3, target: Vector3, state?: CameraState) => void;
  setControlType: (type: "Map" | "CameraControls") => void;
  setIsAnimating: (state: boolean) => void;
  setIsSubscene: (state: boolean) => void;
}

export const INITIAL_POSITIONS = {
  main: {
    position: new Vector3(0, 0, 0),
    target: new Vector3(0, 0, 0),
  },
  subscene: {
    position: new Vector3(0, 0, 0),
    target: new Vector3(0, 0, 0),
  },
} as const;

export const useCameraStore = create<CameraStore>((set) => ({
  position: INITIAL_POSITIONS.main.position,
  target: INITIAL_POSITIONS.main.target,
  controlType: "Map",
  isAnimating: false,
  state: "main",
  isSubscene: false,
  setCamera: (position, target, state = "current") =>
    set({
      position,
      target,
      isAnimating: true,
      state,
    }),
  setIsSubscene: (isSubscene) => set({ isSubscene }),
  setControlType: (controlType) => set({ controlType }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),
}));
