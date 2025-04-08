'use client';
import { Cloud, Clouds, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { memo, useRef } from 'react';
import * as THREE from 'three';

// Define our cloud configurations - made CONSTANT outside the component entirely
const CLOUD_CONFIGS = [
  {
    id: 'cloud1',
    segments: 20,
    scale: 0.8,
    bounds: [12, 2, 2] as [number, number, number],
    position: [0, 60, 50] as [number, number, number],
    volume: 10,
    color: 'white',
  },
  {
    id: 'cloud2',
    segments: 30,
    scale: 1,
    bounds: [8, 2, 2] as [number, number, number],
    position: [-110, 60, 0] as [number, number, number],
    volume: 10,
    color: 'white',
  },
  {
    id: 'cloud3',
    segments: 30,
    scale: 1,
    bounds: [20, 4, 2] as [number, number, number],
    position: [-20, 60, -20] as [number, number, number],
    volume: 10,
    color: 'white',
  },
  {
    id: 'cloud4',
    segments: 40,
    scale: 0.5,
    bounds: [12, 4, 4] as [number, number, number],
    position: [20, 60, -80] as [number, number, number],
    volume: 10,
    color: 'white',
  },
];

// PRE-CREATE each cloud component OUTSIDE of the main component
// This ensures they are only created once in the entire lifecycle
const PrebuiltClouds = CLOUD_CONFIGS.map(config => {
  return (
    <Cloud
      key={config.id}
      segments={config.segments}
      scale={config.scale}
      bounds={config.bounds}
      position={config.position}
      volume={config.volume}
      color={config.color}
    />
  );
});

// All static UI elements pre-created outside the component
const PrebuiltCloudsWrapper = (() => {
  console.log('Creating clouds wrapper element');
  return (
    <Float speed={0.8} floatIntensity={0.3} rotationIntensity={0.1} floatingRange={[-0.08, 0.4]}>
      <Clouds material={THREE.MeshBasicMaterial}>{PrebuiltClouds}</Clouds>
    </Float>
  );
})();

// Main component with extremely minimal render logic
export const AnimatedClouds = memo(() => {
  const cloudsRef = useRef<THREE.Group>(null);

  // Animation logic - this runs every frame but doesn't cause re-renders
  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x += delta * 0.8;

      // Reset position when clouds move too far right
      if (cloudsRef.current.position.x > 200) {
        cloudsRef.current.position.x = -200;
      }
    }
  });

  // Ultra minimal render function with no calculations or object creation
  return (
    <group ref={cloudsRef} position={[-40, 0, 0]}>
      {PrebuiltCloudsWrapper}
    </group>
  );
});

// Add display name for better debugging
AnimatedClouds.displayName = 'AnimatedClouds';

export default AnimatedClouds;
