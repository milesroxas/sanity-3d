import { Vector3 } from 'three';
import { create } from 'zustand';

export const LANDING_CAMERA_POSITIONS = {
  main: {
    position: new Vector3(-4.790607, 15.858616, 83.719627),
    target: new Vector3(-9.08, 22.24, -0.0),
  },
};

interface LandingCameraStore {
  position: Vector3;
  target: Vector3;
  isAnimating: boolean;
  hasAnimated: boolean;

  // Actions
  setCamera: (position: Vector3, target: Vector3) => void;
  setAnimating: (isAnimating: boolean) => void;
  setHasAnimated: (hasAnimated: boolean) => void;
  reset: (preserveAnimatedState?: boolean) => void;
}

export const useLandingCameraStore = create<LandingCameraStore>(set => ({
  position: LANDING_CAMERA_POSITIONS.main.position.clone(),
  target: LANDING_CAMERA_POSITIONS.main.target.clone(),
  isAnimating: false,
  hasAnimated: false,

  setCamera: (position, target) =>
    set({
      position: position.clone(),
      target: target.clone(),
    }),

  setAnimating: isAnimating => set({ isAnimating }),

  setHasAnimated: hasAnimated => set({ hasAnimated }),

  reset: (preserveAnimatedState = false) =>
    set(state => {
      // Create the reset state
      const resetState = {
        position: LANDING_CAMERA_POSITIONS.main.position.clone(),
        target: LANDING_CAMERA_POSITIONS.main.target.clone(),
        isAnimating: false,
        hasAnimated: preserveAnimatedState ? state.hasAnimated : false,
      };

      return resetState;
    }),
}));
