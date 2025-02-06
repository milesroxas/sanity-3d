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
  const { position, target, controlType, isAnimating, selectedPoi } =
    useCameraStore();

  const { positionX, positionY, positionZ, targetX, targetY, targetZ } =
    useControls("Subscene Camera Controls", {
      Subscene: folder(
        {
          position: folder({
            positionX: {
              value: INITIAL_POSITIONS.subscene.position.x,
              min: -200,
              max: 200,
              step: 0.1,
            },
            positionY: {
              value: INITIAL_POSITIONS.subscene.position.y,
              min: -200,
              max: 200,
              step: 0.1,
            },
            positionZ: {
              value: INITIAL_POSITIONS.subscene.position.z,
              min: -200,
              max: 200,
              step: 0.1,
            },
          }),
          target: folder({
            targetX: {
              value: INITIAL_POSITIONS.subscene.target.x,
              min: -200,
              max: 200,
              step: 0.1,
            },
            targetY: {
              value: INITIAL_POSITIONS.subscene.target.y,
              min: -200,
              max: 200,
              step: 0.1,
            },
            targetZ: {
              value: INITIAL_POSITIONS.subscene.target.z,
              min: -200,
              max: 200,
              step: 0.1,
            },
          }),
        },
        { collapsed: true }
      ),
    });

  useEffect(() => {
    if (!cameraRef.current) return;

    // Use Leva controls only when there's no selected POI and not animating
    const newPosition =
      isAnimating || selectedPoi
        ? position
        : new Vector3(positionX, positionY, positionZ);

    const newTarget =
      isAnimating || selectedPoi
        ? target
        : new Vector3(targetX, targetY, targetZ);

    cameraRef.current.position.copy(newPosition);
    cameraRef.current.lookAt(newTarget);

    if (controlsRef.current) {
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
  }, [
    position,
    target,
    isAnimating,
    selectedPoi,
    positionX,
    positionY,
    positionZ,
    targetX,
    targetY,
    targetZ,
  ]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={
          isAnimating || selectedPoi
            ? [position.x, position.y, position.z]
            : [positionX, positionY, positionZ]
        }
      />
      {controlType === "CameraControls" && !isAnimating && (
        <CameraControls
          ref={controlsRef}
          makeDefault
          minDistance={10}
          maxDistance={50}
        />
      )}
      {process.env.NODE_ENV === "development" && (
        <mesh position={[targetX, targetY, targetZ]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="lime" wireframe />
        </mesh>
      )}
    </>
  );
}
