'use client';

import { TEXTURE_PATHS } from '@/experience/constants/textures';
import { Preload, useTexture } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

/**
 * Texture Preloader Component
 *
 * Uses drei's useTexture hook and Preload component to eagerly load all textures
 * used in the texture swap feature. This ensures textures are cached before any
 * user interaction and displayed in the loading screen progress.
 *
 * Features:
 * - Pre-loads textures during initial load screen using drei's loading manager
 * - Automatically integrates with useProgress() hook in Loading component
 * - Memoizes textures via drei's internal cache (prevents re-loading)
 * - Configures textures with optimal settings for the scene
 * - No visual output - purely functional
 *
 * Usage:
 * Place this component inside your Canvas, typically in MainScene or at the root level.
 *
 * @example
 * <Canvas>
 *   <TexturePreloader />
 *   <MainScene />
 * </Canvas>
 */
export function TexturePreloader() {
  // Pre-load both textures used in the swap feature
  // useTexture automatically adds these to drei's loading manager
  // which is tracked by useProgress() in the Loading component
  // Texture paths imported from single source of truth
  const textures = useTexture(TEXTURE_PATHS);

  // Configure textures once loaded
  useEffect(() => {
    Object.values(textures).forEach((texture: THREE.Texture) => {
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    });
  }, [textures]);

  return (
    <>
      {/*
        Preload component from drei - ensures all assets (models, textures, etc.)
        are loaded before the scene is considered "ready"
      */}
      <Preload all />
    </>
  );
}
