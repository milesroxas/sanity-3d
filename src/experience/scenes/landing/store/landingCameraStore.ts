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
  isVideoPlaying: boolean;
  mouseTrackingEnabled: boolean;
  cameraReady: boolean;

  // Actions
  setCamera: (position: Vector3, target: Vector3) => void;
  setAnimating: (isAnimating: boolean) => void;
  setHasAnimated: (hasAnimated: boolean) => void;
  setVideoPlaying: (isPlaying: boolean) => void;
  setMouseTracking: (enabled: boolean) => void;
  setCameraReady: (ready: boolean) => void;
  reset: () => void;
}

export const useLandingCameraStore = create<LandingCameraStore>(set => ({
  position: LANDING_CAMERA_POSITIONS.main.position.clone(),
  target: LANDING_CAMERA_POSITIONS.main.target.clone(),
  isAnimating: false,
  hasAnimated: false,
  isVideoPlaying: false,
  mouseTrackingEnabled: true,
  cameraReady: false,

  setCamera: (position, target) =>
    set({
      position: position.clone(),
      target: target.clone(),
    }),

  setAnimating: isAnimating => set({ isAnimating }),

  setHasAnimated: hasAnimated => set({ hasAnimated }),

  setVideoPlaying: isPlaying => set({ isVideoPlaying: isPlaying }),

  setMouseTracking: enabled => set({ mouseTrackingEnabled: enabled }),

  setCameraReady: ready => set({ cameraReady: ready }),

  reset: () =>
    set({
      position: LANDING_CAMERA_POSITIONS.main.position.clone(),
      target: LANDING_CAMERA_POSITIONS.main.target.clone(),
      isAnimating: false,
      hasAnimated: false,
      isVideoPlaying: false,
      mouseTrackingEnabled: true,
      cameraReady: false,
    }),
}));
