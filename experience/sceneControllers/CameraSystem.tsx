import { MapControls, PerspectiveCamera } from "@react-three/drei";
import { useControls } from "leva";
import { useRef, useEffect } from "react";
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from "three";

export function CameraSystem({ scene }: { scene: Sanity.Scene }) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);

  const { positionX, positionY, positionZ, targetX, targetY, targetZ } =
    useControls({
      positionX: {
        value: scene.mainSceneCameraPosition?.x ?? 0,
        min: -200,
        max: 200,
        step: 0.1,
      },
      positionY: {
        value: scene.mainSceneCameraPosition?.y ?? 0,
        min: -200,
        max: 200,
        step: 0.1,
      },
      positionZ: {
        value: scene.mainSceneCameraPosition?.z ?? 0,
        min: -200,
        max: 200,
        step: 0.1,
      },
      targetX: {
        value: scene.mainSceneCameraTarget?.x ?? 0,
        min: -200,
        max: 200,
        step: 0.1,
      },
      targetY: {
        value: scene.mainSceneCameraTarget?.y ?? 0,
        min: -200,
        max: 200,
        step: 0.1,
      },
      targetZ: {
        value: scene.mainSceneCameraTarget?.z ?? 0,
        min: -200,
        max: 200,
        step: 0.1,
      },
    });

  useEffect(() => {
    if (cameraRef.current) {
      const cam = cameraRef.current;
      const lookAtTarget = new Vector3(targetX, targetY, targetZ);
      cam.lookAt(lookAtTarget);
    }
  }, [targetX, targetY, targetZ]);

  if (!scene.mainSceneCameraPosition || !scene.mainSceneCameraTarget)
    return null;

  return (
    <>
      <MapControls target={new Vector3(targetX, targetY, targetZ)} />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[positionX, positionY, positionZ]}
      />
      <mesh position={[targetX, targetY, targetZ]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>
    </>
  );
}
