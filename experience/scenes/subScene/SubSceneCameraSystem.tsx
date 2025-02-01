// SubSceneCameraSystem.tsx
"use client";
import { PerspectiveCamera, CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import {
  useCameraStore,
  INITIAL_POSITIONS,
} from "@/experience/scenes/store/cameraStore";
import { useControls, folder } from "leva";
import { Vector3 } from "three";

export function SubSceneCameraSystem() {
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const { position, target, controlType, isAnimating } = useCameraStore();

  const { positionX, positionY, positionZ, targetX, targetY, targetZ } =
    useControls("Subscene Camera Controls", {
      Subscene: folder(
        {
          position: folder({
            positionX: { value: position.x, min: -200, max: 200, step: 0.1 },
            positionY: { value: position.y, min: -200, max: 200, step: 0.1 },
            positionZ: { value: position.z, min: -200, max: 200, step: 0.1 },
          }),
          target: folder({
            targetX: { value: target.x, min: -200, max: 200, step: 0.1 },
            targetY: { value: target.y, min: -200, max: 200, step: 0.1 },
            targetZ: { value: target.z, min: -200, max: 200, step: 0.1 },
          }),
        },
        { collapsed: true }
      ),
    });

  useEffect(() => {
    if (!cameraRef.current) return;
    console.log("Camera update:", {
      isAnimating,
      position: position.toArray(),
      target: target.toArray(),
    });

    const newPosition = isAnimating ? position : position.clone();
    const newTarget = isAnimating ? target : target.clone();

    cameraRef.current.position.copy(newPosition);
    cameraRef.current.lookAt(newTarget);

    if (controlsRef.current) {
      console.log("Updating camera controls");
      controlsRef.current.setLookAt(
        newPosition.x,
        newPosition.y,
        newPosition.z,
        newTarget.x,
        newTarget.y,
        newTarget.z,
        true
      );
    }
  }, [position, target, isAnimating]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[position.x, position.y, position.z]}
      />
      {controlType === "CameraControls" && !isAnimating && (
        <CameraControls
          ref={controlsRef}
          makeDefault
          minDistance={10}
          maxDistance={50}
          // minPolarAngle={Math.PI / 4}
          // maxPolarAngle={Math.PI / 2}
          // minAzimuthAngle={-Math.PI / 4}
          // maxAzimuthAngle={Math.PI / 4}
        />
      )}
      {process.env.NODE_ENV === "development" && (
        <mesh position={[target.x, target.y, target.z]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="lime" wireframe />
        </mesh>
      )}
    </>
  );
}
