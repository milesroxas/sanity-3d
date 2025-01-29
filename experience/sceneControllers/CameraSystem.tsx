import {
  CameraControls,
  Environment,
  MapControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useControls } from "leva";
import { useRef, useEffect } from "react";
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from "three";

import { useCameraStore } from "./store/cameraStore";

export function CameraSystem({ scene }: { scene: Sanity.Scene }) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const controlsRef = useRef<CameraControls>(null);

  console.log(
    scene.pointsOfInterest,
    scene.mainSceneCameraPosition,
    scene.mainSceneCameraTarget
  );

  if (!scene.mainSceneCameraPosition || !scene.mainSceneCameraTarget)
    return null;

  const { controlType, setControlType } = useCameraStore();
  useEffect(() => {
    // Set control type based on scene type
    const isMainScene = !scene.sceneType || scene.sceneType === "main";
    setControlType(isMainScene ? "Map" : "CameraControls");

    // Cleanup function to reset control type when leaving
    return () => setControlType("Map");
  }, [setControlType, scene.sceneType]);

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
    if (!cameraRef.current || !controlsRef.current) return;

    const position = new Vector3(positionX, positionY, positionZ);
    const target = new Vector3(targetX, targetY, targetZ);

    // Update camera and controls
    cameraRef.current.position.copy(position);
    controlsRef.current.setLookAt(
      ...position.toArray(),
      ...target.toArray(),
      true
    );
  }, [positionX, positionY, positionZ, targetX, targetY, targetZ]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[positionX, positionY, positionZ]}
      />
      <mesh position={[targetX, targetY, targetZ]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>

      {controlType === "Map" && (
        <MapControls target={[targetX, targetY, targetZ]} />
      )}
      {controlType === "CameraControls" && (
        <CameraControls ref={controlsRef} makeDefault />
      )}
    </>
  );
}
