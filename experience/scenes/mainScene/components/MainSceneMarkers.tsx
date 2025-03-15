"use client";
import { Float, Html, useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Vector3 } from "three";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { Marker } from "@/experience/sceneCollections/markers/Marker";
import { useControls } from "leva";
import { useStoreContext } from "leva/plugin";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type MarkerPosition = {
  x: number;
  y: number;
  z: number;
};

type Position = [number, number, number];

const toPosition = (marker: MarkerPosition): Position => {
  return [marker.x, marker.y, marker.z];
};

// Individual marker component to handle its own hover state
function PoiMarker({
  poi,
  hoveredMarkerId,
  setHoveredMarkerId,
  handleMarkerClick,
}: any) {
  const isHovered = hoveredMarkerId === poi._id;
  const bgColorRef = useRef({ r: 34, g: 197, b: 94 });
  const scaleRef = useRef({ x: 1, y: 1, z: 1 });

  useCursor(isHovered);

  useFrame((_, delta) => {
    // Skip updates when not needed
    if (
      !isHovered &&
      bgColorRef.current.r === 34 &&
      bgColorRef.current.g === 197 &&
      bgColorRef.current.b === 94 &&
      scaleRef.current.x === 1
    ) {
      return;
    }

    // Animate background color
    const targetColor = isHovered
      ? { r: 74, g: 222, b: 128 }
      : { r: 34, g: 197, b: 94 };

    bgColorRef.current = {
      r: THREE.MathUtils.lerp(bgColorRef.current.r, targetColor.r, delta * 5),
      g: THREE.MathUtils.lerp(bgColorRef.current.g, targetColor.g, delta * 5),
      b: THREE.MathUtils.lerp(bgColorRef.current.b, targetColor.b, delta * 5),
    };

    // Animate scale
    const targetScale = 1.2;
    scaleRef.current = {
      x: THREE.MathUtils.lerp(
        scaleRef.current.x,
        isHovered ? targetScale : 1,
        delta * 5
      ),
      y: THREE.MathUtils.lerp(
        scaleRef.current.y,
        isHovered ? targetScale : 1,
        delta * 5
      ),
      z: THREE.MathUtils.lerp(
        scaleRef.current.z,
        isHovered ? targetScale : 1,
        delta * 5
      ),
    };
  });

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
        scale={
          isHovered
            ? [scaleRef.current.x, scaleRef.current.y, scaleRef.current.z]
            : 1
        }
      >
        <Html transform>
          <div
            className="backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer"
            style={{
              backgroundColor: `rgba(${bgColorRef.current.r}, ${bgColorRef.current.g}, ${bgColorRef.current.b}, 0.8)`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkerClick(poi);
            }}
          >
            <h3 className="text-6xl text-white font-bold">{poi.title}</h3>
          </div>
        </Html>
        <group position={[0, -3, 0]}>
          {isHovered && (
            <rectAreaLight
              position={[0, 5, 40]}
              width={20}
              height={20}
              color="#36A837"
              intensity={100}
            />
          )}
          <Marker isHovered={isHovered} />
        </group>
      </group>
    </Float>
  );
}

export default function MainSceneMarkers({ scene }: { scene: Sanity.Scene }) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const store = useStoreContext();
  const router = useRouter();
  const { camera } = useThree();

  const debugMarkerPos = useControls(
    "Main Scene Debug Marker",
    {
      markerX: { value: 0, min: -200, max: 200, step: 0.1 },
      markerY: { value: 0, min: -200, max: 200, step: 0.1 },
      markerZ: { value: 0, min: -200, max: 200, step: 0.1 },
    },
    { collapsed: true }
  );

  // Preload marker model on component mount
  useEffect(() => {
    // Force preload of marker model
    import("@/experience/sceneCollections/markers/Marker").then(() => {
      console.log("Marker model preloaded");
    });
  }, []);

  const handleMarkerClick = (poi: any) => {
    if (!poi.mainSceneCameraPosition || !poi.mainSceneCameraTarget) {
      console.warn("Missing camera position or target:", poi);
      return;
    }

    // Create target vectors
    const targetPos = new Vector3(
      poi.mainSceneCameraPosition.x,
      poi.mainSceneCameraPosition.y,
      poi.mainSceneCameraPosition.z
    );

    const targetLookAt = new Vector3(
      poi.mainSceneCameraTarget.x,
      poi.mainSceneCameraTarget.y,
      poi.mainSceneCameraTarget.z
    );

    useCameraStore.getState().setControlType("Disabled");

    useCameraStore.getState().setPreviousCamera(targetPos, targetLookAt);

    const startTime = Date.now();
    const duration = 2000;
    const startPos = camera.position.clone();
    const startTarget = camera.position
      .clone()
      .add(camera.getWorldDirection(new Vector3()).multiplyScalar(100));

    useCameraStore.getState().setIsAnimating(true);

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic easing
      const t =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newPosition = new Vector3().lerpVectors(startPos, targetPos, t);
      const newTarget = new Vector3().lerpVectors(startTarget, targetLookAt, t);

      useCameraStore.getState().syncCameraPosition(newPosition, newTarget);

      if (progress >= 1) {
        useCameraStore.getState().setIsLoading(true);

        router.push(`/experience/${poi.slug.current}`);
      } else {
        requestAnimationFrame(animate);
      }
    };

    animate();
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
          return (
            <PoiMarker
              key={poi._id}
              poi={poi}
              hoveredMarkerId={hoveredMarkerId}
              setHoveredMarkerId={setHoveredMarkerId}
              handleMarkerClick={handleMarkerClick}
            />
          );
        }
        return null;
      })}

      {store?.get("hidden") === false && (
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
