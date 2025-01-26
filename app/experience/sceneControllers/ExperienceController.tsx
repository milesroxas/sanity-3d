import {
  MapControls,
  OrbitControls,
  PresentationControls,
} from "@react-three/drei";
import { useControlsStore } from "./store/controlsStore";
import { useEffect, memo, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ControlConfigs, ControlType } from "./lib/controllerConfig";

interface ControlProps {
  type: ControlType;
  enabled: boolean;
}

export const ExperienceController = memo(({ type, enabled }: ControlProps) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { cameraConfig, isAnimating } = useControlsStore();

  useEffect(() => {
    if (controlsRef.current && !isAnimating && type === "Orbit") {
      controlsRef.current.target.copy(cameraConfig.target);
    }
  }, [cameraConfig.target, isAnimating, type]);

  const config = {
    ...ControlConfigs[type],
    enabled: enabled && !isAnimating,
    ref: controlsRef,
  };

  if (type === "Presentation") {
    return <PresentationControls {...config} />;
  }

  return type === "Map" ? (
    <MapControls {...config} />
  ) : (
    <OrbitControls {...config} />
  );
});

ExperienceController.displayName = "ExperienceController";
