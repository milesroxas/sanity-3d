import React, { useEffect, useRef } from "react";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { useControlsStore } from "../store/controlsStore";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { usePathname } from "next/navigation";

const ANIMATION_DURATION = 1.5; // seconds

const DEFAULT_POSITION = new Vector3(-10, 70, 200);
const DEFAULT_TARGET = new Vector3(-10, 10, 50);

function CameraController() {
  const cameraRef = useRef<ThreePerspectiveCamera | null>(null);
  const {
    cameraConfig,
    isAnimating,
    setIsAnimating,
    setCameraConfig,
    setControlsConfig,
  } = useControlsStore();
  const pathname = usePathname();
  const isInitialized = useRef(false);

  // Create refs for lerping
  const currentPos = useRef(new Vector3());
  const currentTarget = useRef(new Vector3());
  const startTime = useRef<number | null>(null);

  // Initialize camera position and start animation
  useEffect(() => {
    if (!isInitialized.current && cameraRef.current) {
      console.log("Starting initial camera animation");

      // Set initial position to where the camera currently is
      currentPos.current.copy(cameraRef.current.position);
      currentTarget.current.copy(
        cameraRef.current
          .getWorldDirection(new Vector3())
          .multiplyScalar(-1)
          .add(cameraRef.current.position)
      );

      // Set target position from store
      setCameraConfig({
        position: DEFAULT_POSITION.clone(),
        target: DEFAULT_TARGET.clone(),
        state: "main",
      });

      // Start animation
      setIsAnimating(true);
      isInitialized.current = true;
    }
  }, [setCameraConfig, setIsAnimating]);

  // Handle return to main scene
  useEffect(() => {
    if (pathname === "/experience") {
      console.log("Returning to main scene");

      setControlsConfig({
        enabled: false,
        type: "Map",
      });

      if (cameraRef.current) {
        currentPos.current.copy(cameraRef.current.position);
        currentTarget.current.copy(
          cameraRef.current
            .getWorldDirection(new Vector3())
            .multiplyScalar(-1)
            .add(cameraRef.current.position)
        );
      }

      setCameraConfig({
        position: DEFAULT_POSITION.clone(),
        target: DEFAULT_TARGET.clone(),
        state: "main",
      });

      setIsAnimating(true);

      setTimeout(() => {
        setControlsConfig({
          enabled: true,
          type: "Map",
        });
      }, ANIMATION_DURATION * 1000);
    }
  }, [pathname, setCameraConfig, setControlsConfig, setIsAnimating]);

  useFrame((_, delta) => {
    if (!cameraRef.current || !isAnimating) return;

    const camera = cameraRef.current;

    // Initialize animation
    if (startTime.current === null) {
      console.log("Starting camera animation to:", cameraConfig.state);
      startTime.current = 0;
      currentPos.current.copy(camera.position);
      currentTarget.current.copy(cameraConfig.target);
    }

    startTime.current += delta;
    const progress = Math.min(startTime.current / ANIMATION_DURATION, 1);

    // Smooth easing
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    // Interpolate position
    camera.position.lerpVectors(
      currentPos.current,
      cameraConfig.position,
      easedProgress
    );

    // Interpolate target and update controls
    const newTarget = new Vector3().lerpVectors(
      currentTarget.current,
      cameraConfig.target,
      easedProgress
    );
    camera.lookAt(newTarget);

    // Update matrix
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    // Check if animation is complete
    if (progress >= 1) {
      console.log("Animation complete");
      setIsAnimating(false);
      startTime.current = null;
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={75} />;
}

export default CameraController;
