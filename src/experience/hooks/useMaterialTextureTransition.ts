import { TEXTURE_PATHS } from '@/experience/constants/textures';
import { usePoiInstanceStore } from '@/experience/stores/poiInstanceStore';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Material Texture Transition Hook
 *
 * Manages global texture transitions for all shared materials in the scene.
 * When a POI is activated, smoothly transitions from default to active texture.
 *
 * This hook should be called ONCE at the root of your scene (e.g., MainScene.tsx)
 * to avoid creating multiple texture loaders and animation timelines.
 *
 * How it works:
 * 1. Pre-loads ONLY the two textures used for swapping (never changes)
 * 2. When POI is clicked, animates a smooth transition over 2 seconds
 * 3. Traverses the entire scene and updates all MeshStandardMaterial instances
 *
 * Performance optimizations:
 * - O(n) scene traversal but only during transitions (not every frame)
 * - Fixed texture paths that never change (always cached)
 * - Textures pre-loaded by TexturePreloader
 * - Single source of truth: Texture paths in constants/textures.ts
 */
export function useMaterialTextureTransition() {
  const { scene } = useThree();

  // Get POI state
  const isTransitioning = usePoiInstanceStore(s => s.isTransitioning);
  const activePoi = usePoiInstanceStore(s => s.activePoi);

  // FIXED: Always load the same two textures - never change paths
  // These are pre-loaded by TexturePreloader so they're always cached
  // Texture paths imported from single source of truth
  const textures = useTexture(TEXTURE_PATHS);
  const defaultTexture = textures.defaultTexture;
  const activeTexture = textures.activeTexture;

  // Configure textures once
  useEffect(() => {
    [defaultTexture, activeTexture].forEach(tex => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
    });
  }, [defaultTexture, activeTexture]);

  // Refs for animation state
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const currentTextureRef = useRef<THREE.Texture>(defaultTexture);

  // Update all materials in the scene with the new texture
  const updateSceneMaterials = (newTexture: THREE.Texture) => {
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        const material = object.material;

        // Handle both single materials and material arrays
        const materials = Array.isArray(material) ? material : [material];

        materials.forEach(mat => {
          // Only update MeshStandardMaterial instances that have a map
          if (mat instanceof THREE.MeshStandardMaterial && mat.map) {
            // Check if this material is using our shared texture atlas
            // by comparing the image source
            const currentMap = mat.map;
            if (
              currentMap.source.data?.src?.includes('color-atlas') ||
              currentMap === defaultTexture ||
              currentMap === activeTexture
            ) {
              mat.map = newTexture;
              mat.needsUpdate = true;
            }
          }
        });
      }
    });
  };

  // Animate texture transition
  useEffect(() => {
    if (!isTransitioning) return;

    // Kill any existing timeline
    timelineRef.current?.kill();

    const targetTexture = activePoi ? activeTexture : defaultTexture;

    // Only animate if we're actually changing textures
    if (currentTextureRef.current === targetTexture) {
      return;
    }

    // Create GSAP timeline matching camera animation timing (2000ms)
    // We use a simple delay + instant swap for performance
    timelineRef.current = gsap.timeline({
      onComplete: () => {
        currentTextureRef.current = targetTexture;
        updateSceneMaterials(targetTexture);
      },
    });

    // Delay the swap to happen mid-transition for a smoother feel
    timelineRef.current.to(
      {},
      {
        duration: 1.0, // Swap at 1 second (halfway through 2s camera animation)
        onComplete: () => {
          currentTextureRef.current = targetTexture;
          updateSceneMaterials(targetTexture);
        },
      }
    );

    return () => {
      timelineRef.current?.kill();
    };
  }, [isTransitioning, activePoi, defaultTexture, activeTexture, scene]);

  // Initialize with default texture on mount
  useEffect(() => {
    updateSceneMaterials(defaultTexture);
    currentTextureRef.current = defaultTexture;
  }, [defaultTexture, scene]);
}
