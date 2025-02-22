"use client";
import { Float, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { Vector3 } from "three";
import { Marker } from "@/experience/sceneCollections/markers/Marker";
import { useControls } from "leva";
import { useStoreContext } from "leva/plugin";
import { useThree } from "@react-three/fiber";
import { toPosition } from "@/experience/types/types";
import { PortableTextBlock } from "next-sanity";
import { useSceneStore } from "@/experience/scenes/store/sceneStore";
import { motion, AnimatePresence } from "framer-motion";
import { motion as motion3d } from "framer-motion-3d";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export interface PointOfInterest {
  _key: string;
  _type: "pointOfInterest";
  title: string;
  body?: PortableTextBlock[];
  markerPosition: {
    x: number;
    y: number;
    z: number;
  };
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
  cameraTarget?: {
    x: number;
    y: number;
    z: number;
  };
}

interface SubSceneMarkersProps {
  scene: Sanity.Scene;
  onMarkerClick: (poi: PointOfInterest) => void;
  poiActive: boolean;
}

export default function SubSceneMarkers({
  scene,
  onMarkerClick,
  poiActive,
}: SubSceneMarkersProps) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const { camera } = useThree();
  const [markerOpacity, setMarkerOpacity] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(0);
  const bgColorRef = useRef({ r: 34, g: 197, b: 94 });
  const scaleRef = useRef({ x: 1, y: 1, z: 1 });

  // Move Leva controls hook to the top
  const debugMarkerPos = useControls("Debug Marker Controls", {
    markerX: { value: 1, min: -200, max: 200, step: 0.1 },
    markerY: { value: 10, min: -200, max: 200, step: 0.1 },
    markerZ: { value: 0, min: -200, max: 200, step: 0.1 },
  });

  const store = useStoreContext();

  const validPointsOfInterest = (scene.pointsOfInterest ?? []).filter(
    (poi): poi is PointOfInterest => (poi as any).markerPosition !== undefined
  );

  const handleMarkerClick = (poi: PointOfInterest) => {
    const index = validPointsOfInterest.findIndex((p) => p._key === poi._key);
    useCameraStore.getState().setCurrentPoiIndex(index);
    useCameraStore.getState().setSelectedPoi(poi);
    onMarkerClick(poi);

    // First fade out the UI
    useSceneStore.getState().setPOIActive(true);

    // Wait for UI to fade out before starting camera movement
    setTimeout(() => {
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
      }
    }, 800);
  };

  useFrame((_, delta) => {
    const targetIntensity = hoveredMarkerId ? 10 : 0;
    const newIntensity = THREE.MathUtils.lerp(
      lightIntensity,
      targetIntensity,
      delta * 5
    );
    setLightIntensity(newIntensity);

    // Animate background color
    const targetColor = hoveredMarkerId
      ? { r: 74, g: 222, b: 128 }
      : { r: 34, g: 197, b: 94 };
    bgColorRef.current = {
      r: THREE.MathUtils.lerp(bgColorRef.current.r, targetColor.r, delta * 5),
      g: THREE.MathUtils.lerp(bgColorRef.current.g, targetColor.g, delta * 5),
      b: THREE.MathUtils.lerp(bgColorRef.current.b, targetColor.b, delta * 5),
    };

    // Animate scale for hovered marker
    const targetScale = 1.2;
    scaleRef.current = {
      x: THREE.MathUtils.lerp(
        scaleRef.current.x,
        hoveredMarkerId ? targetScale : 1,
        delta * 5
      ),
      y: THREE.MathUtils.lerp(
        scaleRef.current.y,
        hoveredMarkerId ? targetScale : 1,
        delta * 5
      ),
      z: THREE.MathUtils.lerp(
        scaleRef.current.z,
        hoveredMarkerId ? targetScale : 1,
        delta * 5
      ),
    };
  });

  return (
    <group>
      <AnimatePresence mode="wait">
        {!poiActive && (
          <>
            {validPointsOfInterest.map((poi) => (
              <Float
                key={poi._key}
                speed={3}
                rotationIntensity={0}
                floatIntensity={1}
                floatingRange={[-0.1, 0.1]}
              >
                <group
                  position={toPosition(poi.markerPosition)}
                  onClick={() => handleMarkerClick(poi)}
                  onPointerEnter={() => setHoveredMarkerId(poi._key)}
                  onPointerLeave={() => setHoveredMarkerId(null)}
                  scale={
                    hoveredMarkerId === poi._key
                      ? [
                          scaleRef.current.x,
                          scaleRef.current.y,
                          scaleRef.current.z,
                        ]
                      : 1
                  }
                >
                  <Html transform>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 2,
                      }}
                      style={{
                        backgroundColor: `rgba(${bgColorRef.current.r}, ${bgColorRef.current.g}, ${bgColorRef.current.b}, 0.8)`,
                      }}
                      className="backdrop-blur-sm px-2 py-1 rounded-lg cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkerClick(poi);
                      }}
                    >
                      <h3 className="text-sm text-white font-bold">
                        {poi.title}
                      </h3>
                    </motion.div>
                  </Html>
                  <motion3d.group
                    position={[0, -1, 0]}
                    scale={[0.25, 0.25, 0.25]}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: [0.25, 0.25, 0.25] }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 2,
                    }}
                    onUpdate={(latest) => {
                      setMarkerOpacity(Number(latest.opacity) || 0);
                      console.log("Motion3D opacity:", latest.opacity);
                    }}
                  >
                    <group position={[0, 0, 0]}>
                      {hoveredMarkerId === poi._key && (
                        <>
                          <rectAreaLight
                            position={[0, 5, 20]}
                            width={20}
                            height={20}
                            color="#36A837"
                            intensity={lightIntensity}
                          />
                        </>
                      )}
                      <Marker
                        isHovered={hoveredMarkerId === poi._key}
                        opacity={markerOpacity}
                      />
                    </group>
                  </motion3d.group>
                </group>
              </Float>
            ))}
            {store?.get("hidden") === false && (
              <Float
                speed={10}
                rotationIntensity={0}
                floatIntensity={1}
                floatingRange={[-0.1, 0.1]}
              >
                <group
                  position={toPosition({
                    x: debugMarkerPos.markerX ?? 0,
                    y: debugMarkerPos.markerY ?? 0,
                    z: debugMarkerPos.markerZ ?? 0,
                  })}
                >
                  <Html transform>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 2,
                      }}
                      className="bg-red-500 backdrop-blur-sm px-2 py-1 rounded-lg cursor-pointer"
                    >
                      <h3 className="text-sm font-bold">Debug Marker</h3>
                    </motion.div>
                  </Html>
                  <motion3d.group
                    position={[0, -1, 0]}
                    scale={[0.25, 0.25, 0.25]}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: [0.25, 0.25, 0.25] }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 2,
                    }}
                    onUpdate={(latest) => {
                      setMarkerOpacity(Number(latest.opacity) || 0);
                      console.log("Motion3D opacity:", latest.opacity);
                    }}
                  >
                    <Marker opacity={markerOpacity} />
                  </motion3d.group>
                </group>
              </Float>
            )}
          </>
        )}
      </AnimatePresence>
    </group>
  );
}
