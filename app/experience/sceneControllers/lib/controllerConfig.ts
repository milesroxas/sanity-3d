import { Vector3 } from "three";

export const ANIMATION_DURATION = 1.5; // seconds

export const CameraDefaults = {
  MAIN: {
    position: new Vector3(-10, 60, 200),
    target: new Vector3(-10, 10, 50),
  },
  SUBSCENE: {
    position: new Vector3(0, 5, 20),
    target: new Vector3(0, 0, 0),
  },
} as const;

export type CameraState = "main" | "previous" | "current" | "subscene";
export type ControlType = "Map" | "Orbit" | "Presentation";

export const ControlConfigs = {
  Map: {
    minDistance: 40,
    maxDistance: 260,
    minPolarAngle: Math.PI / 4,
    maxPolarAngle: Math.PI / 2.25,
    enableDamping: true,
    dampingFactor: 0.05,
  },
  Orbit: {
    minDistance: 2,
    maxDistance: 40,
    enableDamping: true,
    dampingFactor: 0.05,
  },
  Presentation: {
    enabled: false,
  },
} as const;
