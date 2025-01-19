import { MapControls, OrbitControls } from "@react-three/drei";
import { useControlsStore } from "../store/controlsStore";
import { useEffect, memo, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type ControlType = "Map" | "Orbit";

interface ControlProps {
  type: ControlType;
  enabled: boolean;
}

const controlConfigs = {
  Map: {
    minDistance: 40,
    maxDistance: 200,
    minPolarAngle: Math.PI / 4, //upward tilt
    maxPolarAngle: Math.PI / 2.25, //downward tilt
    enableDamping: true,
    dampingFactor: 0.05,
  },
  Orbit: {
    minDistance: 2,
    maxDistance: 20,
    enableDamping: true,
    dampingFactor: 0.05,
  },
} as const;

export const ExperienceController = memo(({ type, enabled }: ControlProps) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { cameraConfig, isAnimating } = useControlsStore();

  useEffect(() => {
    if (controlsRef.current && !isAnimating) {
      controlsRef.current.target.set(
        cameraConfig.target.x,
        cameraConfig.target.y,
        cameraConfig.target.z
      );
    }
  }, [cameraConfig.target, isAnimating]);

  const config = {
    ...controlConfigs[type],
    enabled: enabled && !isAnimating,
    ref: controlsRef,
  };

  return type === "Map" ? (
    <MapControls {...config} />
  ) : (
    <OrbitControls {...config} />
  );
});

ExperienceController.displayName = "ExperienceController";
