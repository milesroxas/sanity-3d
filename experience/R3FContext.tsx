import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

export default function R3FContext({ children }: { children: React.ReactNode }) {
  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        outputColorSpace: THREE.SRGBColorSpace,
        pixelRatio: Math.min(window.devicePixelRatio, 2), // Limit pixel ratio for performance
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000,
        position: [0, 0, 5],
      }}
    >
      {children}
    </Canvas>
  );
} 