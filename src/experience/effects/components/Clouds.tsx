'use client';
import React, { useRef, useMemo } from 'react';
import { Cloud, Clouds, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AnimatedClouds = () => {
  const cloudsRef = useRef<THREE.Group>(null);

  // Cloud animation with useFrame
  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x += delta * 0.8;

      // Reset position when clouds move too far right
      if (cloudsRef.current.position.x > 200) {
        cloudsRef.current.position.x = -200;
      }
    }
  });

  // Memoize the Float wrapper and all its children to prevent recreation on each render
  const cloudsContent = useMemo(
    () => (
      <Float speed={0.8} floatIntensity={0.3} rotationIntensity={0.1} floatingRange={[-0.08, 0.4]}>
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud
            segments={20}
            scale={0.8}
            bounds={[12, 2, 2]}
            position={[0, 60, 50]}
            volume={10}
            color="white"
          />
          <Cloud
            segments={50}
            scale={1}
            bounds={[8, 2, 2]}
            position={[-110, 60, 0]}
            volume={10}
            color="white"
          />
          <Cloud
            segments={50}
            bounds={[20, 4, 2]}
            position={[-20, 60, -20]}
            volume={10}
            color="white"
          />
          <Cloud
            segments={60}
            bounds={[12, 4, 4]}
            position={[20, 60, -80]}
            volume={10}
            scale={0.5}
            color="white"
          />
        </Clouds>
      </Float>
    ),
    []
  );

  return (
    <group ref={cloudsRef} position={[-40, 0, 0]}>
      {cloudsContent}
    </group>
  );
};

export default AnimatedClouds;
