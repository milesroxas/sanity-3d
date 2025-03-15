"use client";
import { Float, Html, useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Vector3 } from "three";
import * as THREE from "three";
import { useCameraStore } from "@/experience/scenes/store/cameraStore";
import { LogoMarker } from "@/experience/sceneCollections/markers/LogoMarker";

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
  
  // Add refs for light animation
  const lightRef = useRef<THREE.RectAreaLight>(null);
  
  // Use refs to track the actual DOM elements for direct manipulation
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  
  // Apply cursor effect
  useCursor(isHovered);
  
  // Apply transitions directly when hover state changes
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    // Apply styles directly to avoid React re-renders during transition
    if (isHovered) {
      containerRef.current.style.backgroundColor = 'rgba(74, 222, 128, 0.8)';
      containerRef.current.style.transform = 'scale(1.25)';
      textRef.current.style.transform = 'scale(1.5)';
    } else {
      containerRef.current.style.backgroundColor = 'rgba(34, 197, 94, 0.8)';
      containerRef.current.style.transform = 'scale(1)';
      textRef.current.style.transform = 'scale(1)';
    }
    
    // Update light intensity
    if (lightRef.current) {
      lightRef.current.intensity = isHovered ? 100 : 0;
    }
  }, [isHovered]);

  // Event handlers
  const handlePointerEnter = () => {
    setHoveredMarkerId(poi._id);
  };
  
  const handlePointerLeave = () => {
    setHoveredMarkerId(null);
  };
  
  const handleClick = () => {
    handleMarkerClick(poi);
  };

  // Get the marker position
  const markerPosition = toPosition(poi.mainSceneMarkerPosition);
  
  return (
    <group>
      {/* Single hitbox for 3D interaction */}
      <mesh 
        visible={false}
        position={markerPosition}
        scale={[10, 10, 10]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          transparent 
          opacity={0} 
        />
      </mesh>
      
      <Float
        key={poi._id}
        speed={10}
        rotationIntensity={0}
        floatIntensity={1}
        floatingRange={[-0.1, 0.1]}
      >
        <group position={markerPosition}>
          {/* Logo marker with light */}
          <group position={[0, 0, 0]}>
            <rectAreaLight
              ref={lightRef}
              position={[0, 5, 40]}
              width={20}
              height={20}
              color="#36A837"
              intensity={isHovered ? 100 : 0}
            />
            <LogoMarker 
              isHovered={isHovered} 
              position={[0, 0, 0]}
              scale={1}
            />
          </group>
          
          {/* HTML element positioned below the marker */}
          <group position={[0, -5, 0]}>
            <Html transform distanceFactor={15} zIndexRange={[100, 0]}>
              <div
                ref={containerRef}
                className="backdrop-blur-sm px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'center center',
                  cursor: 'pointer', // Add pointer cursor
                }}
                onMouseEnter={handlePointerEnter}
                onMouseLeave={handlePointerLeave}
                onClick={handleClick}
              >
                <h3 
                  ref={textRef}
                  className="text-6xl text-white font-bold"
                  style={{
                    transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center center',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                >
                  {poi.title}
                </h3>
              </div>
            </Html>
          </group>
        </group>
      </Float>
    </group>
  );
}

export default function LogoMarkers({ scene }: { scene: Sanity.Scene }) {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const router = useRouter();
  const { camera } = useThree();

  // Reset hover state on scene changes or unmount
  useEffect(() => {
    return () => {
      setHoveredMarkerId(null);
    };
  }, [scene]);

  // Preload marker model on component mount
  useEffect(() => {
    // Force preload of marker model
    import("@/experience/sceneCollections/markers/LogoMarker");
  }, []);

  const handleMarkerClick = (poi: any) => {
    if (!poi.mainSceneCameraPosition || !poi.mainSceneCameraTarget) {
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
    </group>
  );
}
