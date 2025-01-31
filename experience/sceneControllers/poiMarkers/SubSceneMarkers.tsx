"use client";
import { Float, Html } from "@react-three/drei";
import { useState } from "react";
import { useCameraStore } from "../store/cameraStore";
import { Vector3 } from "three";
import { Marker } from "./model/Marker";
import { useControls, folder } from "leva";
import { useThree } from "@react-three/fiber";

type MarkerPosition = {
  x: number;
  y: number;
  z: number;
};

type Position = [number, number, number];

const toPosition = (marker: MarkerPosition): Position => {
  return [marker.x, marker.y, marker.z];
};

type PointOfInterest = {
  markerPosition: { x: number; y: number; z: number };
  title: string;
  _key: string;
};

export default function SubSceneMarkers({ scene }: { scene: Sanity.Scene }) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const { camera } = useThree();

  const initialPoi = scene.pointsOfInterest?.[0] as PointOfInterest;

  const { markerX, markerY, markerZ } = useControls("Marker Controls", {
    "Point of Interest": folder(
      {
        markerX: {
          value: initialPoi?.markerPosition?.x ?? 1,
          min: -200,
          max: 200,
          step: 0.1,
        },
        markerY: {
          value: initialPoi?.markerPosition?.y ?? 10,
          min: -200,
          max: 200,
          step: 0.1,
        },
        markerZ: {
          value: initialPoi?.markerPosition?.z ?? 0,
          min: -200,
          max: 200,
          step: 0.1,
        },
      },
      { collapsed: true }
    ),
  });

  console.log(
    "SubSceneMarkers rendering, points of interest:",
    scene.pointsOfInterest
  );

  const handleMarkerClick = (poi: any) => {
    if (poi.cameraPosition && poi.cameraTarget) {
      useCameraStore.getState().setControlType("Disabled");
      useCameraStore
        .getState()
        .startCameraTransition(
          camera.position.clone(),
          new Vector3(
            poi.cameraPosition.x,
            poi.cameraPosition.y,
            poi.cameraPosition.z
          ),
          camera
            .getWorldDirection(new Vector3())
            .multiplyScalar(100)
            .add(camera.position),
          new Vector3(
            poi.cameraTarget.x,
            poi.cameraTarget.y,
            poi.cameraTarget.z
          )
        );
    } else {
      console.warn("Missing camera position or target:", poi);
    }
  };

  return (
    <group>
      {scene.pointsOfInterest?.map((poi) => {
        // Use the Leva controls position regardless of type
        const markerPosition = { x: markerX, y: markerY, z: markerZ };

        console.log("Processing POI:", {
          poi,
          markerPosition,
          leva: { markerX, markerY, markerZ },
        });

        return (
          <group key={poi._key}>
            <Float
              speed={10}
              rotationIntensity={0}
              floatIntensity={1}
              floatingRange={[-0.1, 0.1]}
            >
              <group
                position={toPosition(markerPosition)}
                onClick={() => handleMarkerClick(poi)}
                onPointerEnter={() => setHoveredMarkerId(poi._key)}
                onPointerLeave={() => setHoveredMarkerId(null)}
              >
                <Html transform>
                  <div className="bg-primary backdrop-blur-sm px-2 py-1 rounded-lg cursor-pointer">
                    <h3 className="text-lg font-bold">{poi.title}</h3>
                  </div>
                </Html>
                <group position={[0, -1, 0]} scale={[0.25, 0.25, 0.25]}>
                  <Marker />
                </group>
              </group>
            </Float>
          </group>
        );
      })}
    </group>
  );
}
