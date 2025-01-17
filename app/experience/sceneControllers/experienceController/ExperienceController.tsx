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
    maxDistance: 100,
    minPolarAngle: Math.PI / 4, //upward tilt
    maxPolarAngle: Math.PI / 2.25, //downward tilt
  },
  Orbit: {
    minDistance: 2,
    maxDistance: 20,
  },
} as const;

const commonProps = {
  enableDamping: true,
  dampingFactor: 0.05,
} as const;

export const ExperienceController = memo(({ type, enabled }: ControlProps) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { cameraConfig } = useControlsStore();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(
        cameraConfig.target.x,
        cameraConfig.target.y,
        cameraConfig.target.z
      );
    }
  }, [cameraConfig.target]);

  const config = {
    ...commonProps,
    ...controlConfigs[type],
    enabled,
    ref: controlsRef,
  };

  return type === "Map" ? (
    <MapControls {...config} />
  ) : (
    <OrbitControls {...config} />
  );
});

ExperienceController.displayName = "ExperienceController";
