"use client";
import { Float, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vector3 } from "three";
import { useCameraStore } from "../store/cameraStore";
import { Marker } from "@/experience/sceneControllers/poiMarkers/model/Marker";
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

  const router = useRouter();
  const { camera } = useThree();

  const handleMarkerClick = (poi: any) => {
    if (!poi.mainSceneCameraPosition || !poi.mainSceneCameraTarget) {
      console.warn("Missing camera position or target:", poi);
      return;
    }

    // Set loading state immediately
    useCameraStore.getState().setIsLoading(true);

    // Store current camera position before transitioning
    useCameraStore
      .getState()
      .setPreviousCamera(
        camera.position.clone(),
        camera
          .getWorldDirection(new Vector3())
          .multiplyScalar(100)
          .add(camera.position)
      );

    // Start the camera transition
    useCameraStore
      .getState()
      .startCameraTransition(
        camera.position.clone(),
        new Vector3(
          poi.mainSceneCameraPosition.x,
          poi.mainSceneCameraPosition.y,
          poi.mainSceneCameraPosition.z
        ),
        camera
          .getWorldDirection(new Vector3())
          .multiplyScalar(100)
          .add(camera.position),
        new Vector3(
          poi.mainSceneCameraTarget.x,
          poi.mainSceneCameraTarget.y,
          poi.mainSceneCameraTarget.z
        )
      );

    // Navigate after animation completes
    setTimeout(() => {
      router.push(`/experience/${poi.slug.current}`);
    }, 1800); // Slightly shorter than animation duration
  };

  return (
    <group>
      {scene.pointsOfInterest?.map((poi) => {
        if (
          "_type" in poi &&
          poi._type === "scenes" &&
          "mainSceneMarkerPosition" in poi &&
          poi.mainSceneMarkerPosition &&
          "slug" in poi
        ) {
          const isHovered = hoveredMarkerId === poi._id;
          return (
            <Float
              key={poi._id}
              speed={10}
              rotationIntensity={0}
              floatIntensity={1}
              floatingRange={[-0.1, 0.1]}
            >
              <group
                position={toPosition(poi.mainSceneMarkerPosition)}
                onClick={() => handleMarkerClick(poi)}
                onPointerEnter={() => setHoveredMarkerId(poi._id)}
                onPointerLeave={() => setHoveredMarkerId(null)}
              >
                <Html transform>
                  <div className="bg-primary backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer">
                    <h3 className="text-2xl font-bold">{poi.title}</h3>
                  </div>
                </Html>
                <group position={[0, -3, 0]}>
                  <Marker />
                </group>
              </group>
            </Float>
          );
        }
        return null;
      })}
    </group>
  );
}
