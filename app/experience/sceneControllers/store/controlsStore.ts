import { Vector3 } from "three";
import { create } from "zustand";
import {
  CameraDefaults,
  CameraState,
  ControlType,
} from "../lib/controllerConfig";

interface CameraConfig {
  position: Vector3;
  target: Vector3;
  state: CameraState;
}

interface ControlsStore {
  cameraConfig: CameraConfig;
  cameraPrevious: Omit<CameraConfig, "state"> | null;
  controlsConfig: {
    enabled: boolean;
    type: ControlType;
  };
  isAnimating: boolean;

  /*
  Actions
  */
  setCameraConfig: (config: CameraConfig) => void;
  setCameraPrevious: (config: Omit<CameraConfig, "state">) => void;
  setControlsConfig: (config: { enabled: boolean; type: ControlType }) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  handleCameraTransition: (
    config: CameraConfig & { controlType: ControlType }
  ) => void;
}

export const useControlsStore = create<ControlsStore>((set, get) => ({
  cameraConfig: {
    position: CameraDefaults.MAIN.position.clone(),
    target: CameraDefaults.MAIN.target.clone(),
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
  handleCameraTransition: (config) => {
    const { position, target, state, controlType } = config;
    const ANIMATION_DURATION = 1.5;

    // Disable controls during transition
    set({
      controlsConfig: {
        enabled: false,
        type: controlType,
      },
      isAnimating: true,
    });

    // Update camera configuration with correct state type
    set((prevState) => ({
      cameraPrevious: {
        position: prevState.cameraConfig.position.clone(),
        target: prevState.cameraConfig.target.clone(),
      },
      cameraConfig: {
        position: position.clone(),
        target: target.clone(),
        state: state as "main" | "previous" | "current" | "subscene",
      },
    }));

    // Re-enable controls after animation
    setTimeout(() => {
      set({
        controlsConfig: {
          enabled: true,
          type: controlType,
        },
      });
    }, ANIMATION_DURATION * 1000);
  },
}));
