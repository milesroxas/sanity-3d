import React, { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { useControlsStore } from "../store/controlsStore";
import { PerspectiveCamera } from "@react-three/drei";

function CameraController() {
  const cameraRef = useRef<ThreePerspectiveCamera | null>(null);
  const { cameraConfig, setCameraConfig } = useControlsStore();

  // Update camera position and target when cameraConfig changes
  useEffect(() => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    const { position, target } = cameraConfig;

    // Smoothly interpolate camera position
    camera.position.lerp(position, 0.1);

    // Update lookAt target
    camera.lookAt(target);

    // Force camera matrix update
    camera.updateMatrixWorld();
  }, [cameraConfig]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[
          cameraConfig.position.x,
          cameraConfig.position.y,
          cameraConfig.position.z,
        ]}
        fov={75}
      />
      {/* Debug target point */}
      <mesh
        visible={false}
        position={[
          cameraConfig.target.x,
          cameraConfig.target.y,
          cameraConfig.target.z,
        ]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </>
  );
}

export default CameraController;
