"use client";
import { Float, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vector3 } from "three";
import { useCameraStore } from "../../store/cameraStore";
import { Marker } from "@/experience/sceneCollections/markers/Marker";
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

  const router = useRouter();
  const { camera } = useThree();

  // Add Leva controls for debug marker
  const debugMarkerPos = useControls("Main Scene Debug Marker", {
    markerX: { value: 0, min: -200, max: 200, step: 0.1 },
    markerY: { value: 0, min: -200, max: 200, step: 0.1 },
    markerZ: { value: 0, min: -200, max: 200, step: 0.1 },
  });

  const handleMarkerClick = (poi: any) => {
    if (!poi.mainSceneCameraPosition || !poi.mainSceneCameraTarget) {
      console.warn("Missing camera position or target:", poi);
      return;
    }

    // Start camera transition without loading state
    useCameraStore.getState().setIsLoading(false);
    useCameraStore
      .getState()
      .startCameraTransition(
        camera.position.clone(),
        new Vector3(
          poi.mainSceneCameraPosition.x,
          poi.mainSceneCameraPosition.y,
          poi.mainSceneCameraPosition.z
        ),
        camera.position
          .clone()
          .add(camera.getWorldDirection(new Vector3()).multiplyScalar(100)),
        new Vector3(
          poi.mainSceneCameraTarget.x,
          poi.mainSceneCameraTarget.y,
          poi.mainSceneCameraTarget.z
        )
      );

    // After camera animation completes, set loading and navigate
    setTimeout(() => {
      useCameraStore.getState().setIsLoading(true);
      router.push(`/experience/${poi.slug.current}`);
    }, 2000);
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
                  <div
                    className="bg-primary backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkerClick(poi);
                    }}
                  >
                    <h3 className="text-2xl text-white font-bold">
                      {poi.title}
                    </h3>
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

      {/* Debug marker */}
      {process.env.NODE_ENV === "development" && (
        <Float
          speed={10}
          rotationIntensity={0}
          floatIntensity={1}
          floatingRange={[-0.1, 0.1]}
        >
          <group
            position={[
              debugMarkerPos.markerX,
              debugMarkerPos.markerY,
              debugMarkerPos.markerZ,
            ]}
          >
            <Html transform>
              <div className="bg-red-500 backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer">
                <h3 className="text-2xl text-white font-bold">Debug Marker</h3>
              </div>
            </Html>
            <group position={[0, -3, 0]}>
              <Marker />
            </group>
          </group>
        </Float>
      )}
    </group>
  );
}
