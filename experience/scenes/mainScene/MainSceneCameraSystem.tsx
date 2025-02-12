// MainSceneCameraSystem.tsx
import { MapControls, PerspectiveCamera } from "@react-three/drei";
import { useControls, folder } from "leva";
import { useRef, useEffect } from "react";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import {
  INITIAL_POSITIONS,
  useCameraStore,
} from "@/experience/scenes/store/cameraStore";

export function MainSceneCameraSystem() {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const { controlType, isAnimating, position, target } = useCameraStore();

  const { positionX, positionY, positionZ, targetX, targetY, targetZ } =
    useControls("Main Camera Controls", {
      "Main Scene": folder(
        {
          position: folder({
            positionX: {
              value: INITIAL_POSITIONS.main.position.x,
              min: -200,
              max: 200,
              step: 0.1,
            },
            positionY: {
              value: INITIAL_POSITIONS.main.position.y,
              min: -200,
              max: 200,
              step: 0.1,
            },
            positionZ: {
              value: INITIAL_POSITIONS.main.position.z,
              min: -200,
              max: 200,
              step: 0.1,
            },
          }),
          target: folder({
            targetX: {
              value: INITIAL_POSITIONS.main.target.x,
              min: -200,
              max: 200,
              step: 0.1,
            },
            targetY: {
              value: INITIAL_POSITIONS.main.target.y,
              min: -200,
              max: 200,
              step: 0.1,
            },
            targetZ: {
              value: INITIAL_POSITIONS.main.target.z,
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
    const newPosition = isAnimating ? position : position.clone();
    const newTarget = isAnimating ? target : target.clone();

    cameraRef.current.position.copy(newPosition);
    cameraRef.current.lookAt(newTarget);
  }, [isAnimating, position, target]);

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
      {controlType === "Map" && !isAnimating && (
        <MapControls
          target={[targetX, targetY, targetZ]}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
          maxAzimuthAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 2}
          maxDistance={200}
          minDistance={10}
        />
      )}
    </>
  );
}
