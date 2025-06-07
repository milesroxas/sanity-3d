import { Vector3 } from 'three';
import { create } from 'zustand';

export const LANDING_CAMERA_POSITIONS = {
  main: {
    position: new Vector3(8, 15, 100),
    target: new Vector3(5, 15, 0),
  },
};

interface LandingCameraStore {
  position: Vector3;
  target: Vector3;
  isAnimating: boolean;

  // Actions
  setCamera: (position: Vector3, target: Vector3) => void;
  setAnimating: (isAnimating: boolean) => void;
  reset: () => void;
}

export const useLandingCameraStore = create<LandingCameraStore>(set => ({
  position: LANDING_CAMERA_POSITIONS.main.position.clone(),
  target: LANDING_CAMERA_POSITIONS.main.target.clone(),
  isAnimating: false,

  setCamera: (position, target) =>
    set({
      position: position.clone(),
      target: target.clone(),
    }),

  setAnimating: isAnimating => set({ isAnimating }),

  reset: () =>
    set({
      position: LANDING_CAMERA_POSITIONS.main.position.clone(),
      target: LANDING_CAMERA_POSITIONS.main.target.clone(),
      isAnimating: false,
    }),
}));
