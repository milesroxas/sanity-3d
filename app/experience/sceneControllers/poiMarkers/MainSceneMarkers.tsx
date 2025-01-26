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

export default function MainSceneMarkers({ scene }: { scene: Sanity.Scene }) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const { setIsAnimating, setCameraConfig, setControlsConfig } =
    useControlsStore();
  const router = useRouter();

  // Add Leva controls for marker position
  const { x, y, z } = useControls("Main Scene Marker Position", {
    x: { value: 0, min: -200, max: 200, step: 1 },
    y: { value: 40, min: -200, max: 200, step: 1 },
    z: { value: 50, min: -200, max: 200, step: 1 },
  });

  const handleMarkerClick = (poi: any) => {
    if (poi.mainSceneCameraPosition && poi.mainSceneCameraTarget) {
      console.log("Setting camera config and starting animation");
      // Set new camera configuration with subscene state
      setCameraConfig({
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
      });

      setControlsConfig({
        enabled: false,
        type: "Orbit",
      });

      // Start animation
      setIsAnimating(true);

      // Navigate after a delay
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
    <group>
      {debugMarker}
      {scene.pointsOfInterest
        ?.filter(
          (
            poi
          ): poi is {
            _key: string;
            _type: "scenes";
            _id: string;
            title: string;
            slug: { current: string };
            mainSceneMarkerPosition: { x: number; y: number; z: number };
          } =>
            "_type" in poi &&
            poi._type === "scenes" &&
            "mainSceneMarkerPosition" in poi &&
            poi.mainSceneMarkerPosition !== undefined &&
            "slug" in poi
        )
        .map((poi) => {
          const isHovered = hoveredMarkerId === poi._id;
          return (
            <group
              key={poi._key ?? poi._id}
              position={toPosition(poi.mainSceneMarkerPosition)}
            >
              <Html center transform>
                <div
                  className="bg-primary backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer"
                  onClick={() => handleMarkerClick(poi)}
                  onMouseEnter={() => setHoveredMarkerId(poi._id)}
                  onMouseLeave={() => setHoveredMarkerId(null)}
                >
                  <h3 className="text-6xl font-bold">{poi.title}</h3>
                </div>
              </Html>
              <group
                position={[0, -3, 0]}
                onClick={() => handleMarkerClick(poi)}
                onPointerEnter={() => setHoveredMarkerId(poi._id)}
                onPointerLeave={() => setHoveredMarkerId(null)}
              >
                <Marker />
              </group>
            </group>
          );
        })}
    </group>
  );
}
