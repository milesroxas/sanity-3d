"use client";
import { Html } from "@react-three/drei";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function MainSceneMarkers({ scene }: { scene: Sanity.Scene }) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const { setIsAnimating, setCameraConfig, setControlsConfig } =
    useControlsStore();
  const router = useRouter();

  console.log("Scene POIs:", scene.pointsOfInterest);
  console.log("Referenced Scene:", scene.pointsOfInterest?.[0]);

  const handleMarkerClick = (poi: any) => {
    if (poi.mainSceneCameraPosition && poi.mainSceneCameraTarget) {
      console.log("Setting camera config and starting animation");
      // Disable controls during animation
      setControlsConfig({
        enabled: false,
        type: "Map",
      });

      // Set new camera configuration
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
        state: "current",
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

  return (
    <group>
      {scene.pointsOfInterest?.map((poi) => {
        console.log("Processing POI:", poi);

        if (
          "_type" in poi &&
          poi._type === "scenes" &&
          "mainSceneMarkerPosition" in poi &&
          poi.mainSceneMarkerPosition &&
          "slug" in poi
        ) {
          console.log(
            "Found valid POI with position:",
            poi.mainSceneMarkerPosition
          );
          const isHovered = hoveredMarkerId === poi._id;
          return (
            <group
              key={poi._id}
              position={toPosition(poi.mainSceneMarkerPosition)}
              onClick={() => handleMarkerClick(poi)}
              onPointerEnter={() => setHoveredMarkerId(poi._id)}
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
