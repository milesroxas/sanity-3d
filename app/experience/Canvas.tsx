"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html } from "@react-three/drei";
import CameraController from "./sceneControllers/CameraController";
import { Leva } from "leva";
import { ExperienceController } from "./sceneControllers/ExperienceController";

export default function Experience({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Leva hidden={process.env.NODE_ENV === "production"} />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {/* <CameraController /> */}

        <Suspense
          fallback={
            <Html>
              <div>Loading...</div>
            </Html>
          }
        >
          {children}
        </Suspense>
      </Canvas>
    </>
  );
}
