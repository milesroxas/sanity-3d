import {
  CameraControls,
  MapControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useControls, folder } from "leva";
import { useRef, useEffect } from "react";
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from "three";

import { INITIAL_POSITIONS, useCameraStore } from "./store/cameraStore";

export function CameraSystem({ scene }: { scene: Sanity.Scene }) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<CameraControls>(null);
  const { controlType, isAnimating, position, target, isSubscene } =
    useCameraStore();

  // Get initial values based on scene type
  const initialPosition = isSubscene
    ? INITIAL_POSITIONS.subscene.position
    : INITIAL_POSITIONS.main.position;
  const initialTarget = isSubscene
    ? INITIAL_POSITIONS.subscene.target
    : INITIAL_POSITIONS.main.target;

  const { positionX, positionY, positionZ, targetX, targetY, targetZ } =
    useControls(
      "Camera Controls",
      {
        [isSubscene ? "Subscene" : "Main Scene"]: folder(
          {
            position: folder({
              positionX: {
                value: initialPosition.x,
                min: -200,
                max: 200,
                step: 0.1,
              },
              positionY: {
                value: initialPosition.y,
                min: -200,
                max: 200,
                step: 0.1,
              },
              positionZ: {
                value: initialPosition.z,
                min: -200,
                max: 200,
                step: 0.1,
              },
            }),
            target: folder({
              targetX: {
                value: initialTarget.x,
                min: -200,
                max: 200,
                step: 0.1,
              },
              targetY: {
                value: initialTarget.y,
                min: -200,
                max: 200,
                step: 0.1,
              },
              targetZ: {
                value: initialTarget.z,
                min: -200,
                max: 200,
                step: 0.1,
              },
            }),
          },
          { collapsed: true }
        ),
      },
      [isSubscene] // Add isSubscene as a dependency to force control recreation
    );

  useEffect(() => {
    if (!cameraRef.current) return;

    // Use the current animated position or the scene-appropriate initial position
    const newPosition = isAnimating
      ? position
      : isSubscene
        ? INITIAL_POSITIONS.subscene.position.clone()
        : position.clone();

    const newTarget = isAnimating
      ? target
      : isSubscene
        ? INITIAL_POSITIONS.subscene.target.clone()
        : target.clone();

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
  }, [isAnimating, position, target, isSubscene]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={
          isAnimating
            ? [position.x, position.y, position.z]
            : [positionX, positionY, positionZ]
        }
      />

      {/* Debug sphere for camera target */}
      {process.env.NODE_ENV === "development" && (
        <mesh
          position={
            isAnimating
              ? [target.x, target.y, target.z]
              : [targetX, targetY, targetZ]
          }
        >
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      )}

      {!isSubscene && controlType === "Map" && !isAnimating && (
        <MapControls target={[targetX, targetY, targetZ]} />
      )}
      {(isSubscene || controlType === "CameraControls") && !isAnimating && (
        <CameraControls ref={controlsRef} makeDefault />
      )}
    </>
  );
}
