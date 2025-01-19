"use client";
import { Html } from "@react-three/drei";
import { useState } from "react";
import { useControlsStore } from "../store/controlsStore";
import { Vector3 } from "three";

type MarkerPosition = {
  x: number;
  y: number;
  z: number;
};

type Position = [number, number, number];

const toPosition = (marker: MarkerPosition): Position => {
  return [marker.x, marker.y, marker.z];
};

export default function SubSceneMarkers({ scene }: { scene: Sanity.Scene }) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const { setIsAnimating, setCameraConfig, setControlsConfig } =
    useControlsStore();

  const handleMarkerClick = (poi: any) => {
    if (poi.cameraPosition && poi.cameraTarget) {
      // Disable controls during animation
      setControlsConfig({
        enabled: false,
        type: "Orbit",
      });

      // Set new camera configuration
      setCameraConfig({
        position: new Vector3(
          poi.cameraPosition.x,
          poi.cameraPosition.y,
          poi.cameraPosition.z
        ),
        target: new Vector3(
          poi.cameraTarget.x,
          poi.cameraTarget.y,
          poi.cameraTarget.z
        ),
        state: "current",
      });

      // Start animation
      setIsAnimating(true);

      // Re-enable controls after animation
      setTimeout(() => {
        setControlsConfig({
          enabled: true,
          type: "Orbit",
        });
      }, 1500);
    }
  };

  return (
    <group>
      {scene.pointsOfInterest?.map((poi) => {
        if ("markerPosition" in poi && poi.markerPosition) {
          const isHovered = hoveredMarkerId === poi._key;
          return (
            <group
              key={poi._key}
              position={toPosition(poi.markerPosition)}
              onClick={() => handleMarkerClick(poi)}
              onPointerEnter={() => setHoveredMarkerId(poi._key)}
              onPointerLeave={() => setHoveredMarkerId(null)}
            >
              <Html>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <h3 className="text-lg font-bold">{poi.title}</h3>
                </div>
              </Html>
              <mesh>
                <sphereGeometry args={[1, 52, 52]} />
                <meshStandardMaterial
                  color={isHovered ? "hotpink" : "pink"}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            </group>
          );
        }
        return null;
      })}
    </group>
  );
}
