"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./mainScene/Scene";
import { Html } from "@react-three/drei";
import CameraController from "./sceneControllers/cameraController/CameraController";

export default function Experience() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <CameraController />
      <Suspense
        fallback={
          <Html>
            <div>Loading...</div>
          </Html>
        }
      >
        <Scene />
      </Suspense>
    </Canvas>
  );
}
