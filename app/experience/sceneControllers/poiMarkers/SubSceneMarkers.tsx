"use client";
import { Float, Html } from "@react-three/drei";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useControlsStore } from "../store/controlsStore";
import { Vector3 } from "three";
import { Marker } from "./model/Marker";
import { useControls } from "leva";

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
  const { handleCameraTransition } = useControlsStore();
  const router = useRouter();

  // Add Leva controls for marker position
  const { x, y, z } = useControls("Marker Position", {
    x: { value: 0, min: -200, max: 200, step: 1 },
    y: { value: 0, min: -200, max: 200, step: 1 },
    z: { value: 0, min: -200, max: 200, step: 1 },
  });

  const handleMarkerClick = (poi: any) => {
    if (poi.mainSceneCameraPosition && poi.mainSceneCameraTarget) {
      handleCameraTransition({
        position: new Vector3(
          poi.mainSceneCameraPosition.x,
          poi.mainSceneCameraPosition.y,
          poi.mainSceneCameraPosition.z
        ),
        target: new Vector3(
          poi.mainSceneCameraTarget.x,
          poi.mainSceneCameraTarget.y,
          poi.mainSceneCameraTarget.z
        ),
        state: "subscene",
        controlType: "Orbit",
      });

      setTimeout(() => {
        router.push(`/experience/${poi.slug.current}`);
      }, 1500);
    } else {
      console.warn("Missing camera position or target:", poi);
    }
  };

  // Debug marker with Leva controls
  const debugMarker = (
    <group position={[x, y, z]}>
      <Html center transform>
        <div className="bg-primary backdrop-blur-sm px-4 py-2 rounded-lg">
          <h3 className="text-6xl font-bold">Debug Marker</h3>
        </div>
      </Html>
      <group position={[0, -3, 0]}>
        <Marker />
      </group>
    </group>
  );

  return (
    <>
      {debugMarker}
      <group>
        {scene.pointsOfInterest
          ?.filter(
            (
              poi
            ): poi is {
              _key: string;
              _type: "pointOfInterest";
              title: string;
              markerPosition: { x: number; y: number; z: number };
            } =>
              "_type" in poi &&
              poi._type === "pointOfInterest" &&
              "markerPosition" in poi &&
              poi.markerPosition !== undefined
          )
          .map((poi) => {
            const isHovered = hoveredMarkerId === poi._key;
            return (
              <group key={poi._key} position={toPosition(poi.markerPosition)}>
                <Html center transform>
                  <div
                    className="bg-primary backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer"
                    onClick={() => handleMarkerClick(poi)}
                    onMouseEnter={() => setHoveredMarkerId(poi._key)}
                    onMouseLeave={() => setHoveredMarkerId(null)}
                  >
                    <h3 className="text-md font-bold">{poi.title}</h3>
                  </div>
                </Html>
                <group
                  position={[0, -3, 0]}
                  onClick={() => handleMarkerClick(poi)}
                  onPointerEnter={() => setHoveredMarkerId(poi._key)}
                  onPointerLeave={() => setHoveredMarkerId(null)}
                >
                  <Marker />
                </group>
              </group>
            );
          })}
      </group>
    </>
  );
}
