"use client";
import { Suspense, useEffect, useRef } from "react";
import { getSceneComponent, SceneType } from "./lib/SubSceneComponentMap";
import SubSceneMarkers from "@/app/experience/sceneControllers/poiMarkers/SubSceneMarkers";
import {
  Environment,
  PerspectiveCamera,
  CameraControls,
  PresentationControls,
} from "@react-three/drei";
import { ExperienceController } from "@/app/experience/sceneControllers/ExperienceController";
import { useControlsStore } from "@/app/experience/sceneControllers/store/controlsStore";
import { CameraDefaults } from "@/app/experience/sceneControllers/lib/controllerConfig";
import { folder, useControls } from "leva";
import * as THREE from "three";

export default function SubScene({ scene }: { scene: Sanity.Scene }) {
  const { handleCameraTransition, cameraConfig } = useControlsStore();
  const cameraTargetRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    handleCameraTransition({
      position: CameraDefaults.SUBSCENE.position.clone(),
      target: CameraDefaults.SUBSCENE.target.clone(),
      state: "subscene",
      controlType: "Presentation",
    });
  }, [handleCameraTransition]);

  if (!scene.sceneType) {
    console.warn("No scene type specified");
    return null;
  }

  const { posX, posY, posZ, cameraTargetX, cameraTargetY, cameraTargetZ } =
    useControls({
      camera: folder({
        posX: { value: 0, min: -20, max: 20, step: 0.5 },
        posY: { value: 2, min: -20, max: 20, step: 0.5 },
        posZ: { value: 20, min: -20, max: 20, step: 0.5 },
      }),
      cameraTarget: folder({
        cameraTargetX: { value: 0, min: -20, max: 20, step: 0.5 },
        cameraTargetY: { value: 1, min: -20, max: 20, step: 0.5 },
        cameraTargetZ: { value: 0, min: -20, max: 20, step: 0.5 },
      }),
    });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setLookAt(
        posX,
        posY,
        posZ,
        cameraTargetX,
        cameraTargetY,
        cameraTargetZ,
        true
      );
    }
  }, [posX, posY, posZ, cameraTargetX, cameraTargetY, cameraTargetZ]);

  const SceneComponent = getSceneComponent(scene.sceneType as SceneType);

  return (
    <>
      <Environment preset="sunset" />
      <ExperienceController type="Presentation" enabled={true} />

      <Suspense fallback={null}>
        <group position={[-20, -5, -5]}>
          <SceneComponent modelFiles={scene.modelFiles} modelIndex={0} />
        </group>
      </Suspense>
      <mesh
        ref={cameraTargetRef}
        position={[cameraTargetX, cameraTargetY, cameraTargetZ]}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>
      <SubSceneMarkers scene={scene} />
    </>
  );
}
