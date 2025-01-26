import React, { useEffect, useRef } from "react";
import { useControlsStore } from "./store/controlsStore";
import { PerspectiveCamera as DreiPerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { usePathname } from "next/navigation";
import { CameraDefaults } from "./lib/controllerConfig";

const ANIMATION_DURATION = 1.5; // seconds

function CameraController() {
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const { cameraConfig, isAnimating, setIsAnimating, setCameraConfig } =
    useControlsStore();
  const pathname = usePathname();
  const isSubscene = pathname.includes("/experience/");

  const animationState = useRef({
    startTime: null as number | null,
    currentPos: new Vector3(),
    currentTarget: new Vector3(),
  });

  useEffect(() => {
    if (cameraRef.current) {
      const config = isSubscene ? CameraDefaults.SUBSCENE : CameraDefaults.MAIN;
      cameraRef.current.position.copy(config.position);
      cameraRef.current.lookAt(config.target);

      setCameraConfig({
        position: config.position.clone(),
        target: config.target.clone(),
        state: isSubscene ? "subscene" : "main",
      });
    }
  }, [isSubscene, setCameraConfig]);

  useFrame((_, delta) => {
    if (!cameraRef.current || !isAnimating) return;

    if (animationState.current.startTime === null) {
      animationState.current.startTime = 0;
      animationState.current.currentPos.copy(cameraRef.current.position);
      animationState.current.currentTarget.copy(cameraConfig.target);
    }

    animationState.current.startTime += delta;
    const progress = Math.min(
      animationState.current.startTime / ANIMATION_DURATION,
      1
    );
    const easedProgress = progress;

    cameraRef.current.position.lerpVectors(
      animationState.current.currentPos,
      cameraConfig.position,
      easedProgress
    );

    const newTarget = new Vector3().lerpVectors(
      animationState.current.currentTarget,
      cameraConfig.target,
      easedProgress
    );
    cameraRef.current.lookAt(newTarget);

    if (progress >= 1) {
      setIsAnimating(false);
      animationState.current.startTime = null;
    }
  });

  return <DreiPerspectiveCamera ref={cameraRef} makeDefault fov={75} />;
}

export default CameraController;
