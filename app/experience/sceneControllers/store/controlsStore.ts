import { Vector3 } from "three";
import { create } from "zustand";

interface ControlsStore {
  cameraConfig: {
    position: Vector3;
    target: Vector3;
    state: "main" | "previous" | "current" | "subscene";
  };
  cameraPrevious: {
    position: Vector3;
    target: Vector3;
  } | null;

  controlsConfig: {
    enabled: boolean;
    type: "Map" | "Orbit";
  };

  isAnimating: boolean;

  /*
  Actions
  */
  setCameraConfig: (config: {
    position: Vector3;
    target: Vector3;
    state: "main" | "previous" | "current" | "subscene";
  }) => void;

  setCameraPrevious: (config: { position: Vector3; target: Vector3 }) => void;

  setControlsConfig: (config: {
    enabled: boolean;
    type: "Map" | "Orbit";
  }) => void;

  setIsAnimating: (isAnimating: boolean) => void;
}

export const useControlsStore = create<ControlsStore>((set) => ({
  cameraConfig: {
    position: new Vector3(-10, 70, 200),
    target: new Vector3(-10, 10, 50),
    state: "main",
  },
  cameraPrevious: null,
  controlsConfig: {
    enabled: true,
    type: "Map",
  },
  isAnimating: false,

  //Actions
  setCameraConfig: (config) => {
    set((state) => ({
      cameraPrevious: {
        position: state.cameraConfig.position.clone(),
        target: state.cameraConfig.target.clone(),
      },
      cameraConfig: config,
    }));
  },
  setCameraPrevious: (config) => set({ cameraPrevious: config }),
  setControlsConfig: (config) => set({ controlsConfig: config }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),
}));
