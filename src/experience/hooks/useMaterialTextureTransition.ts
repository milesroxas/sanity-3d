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
 * 1. Loads both default and active textures upfront (drei caches them)
 * 2. When POI is clicked, animates a smooth transition over 2 seconds
 * 3. Traverses the entire scene and updates all MeshStandardMaterial instances
 *
 * Performance: O(n) scene traversal but only during transitions (not every frame)
 * Single source of truth: POI store manages state, this hook applies it
 */
export function useMaterialTextureTransition() {
  const { scene } = useThree();

  // Get POI state - single source of truth
  const defaultTexturePath = usePoiInstanceStore(s => s.defaultTexture);
  const activeTexturePath = usePoiInstanceStore(s => s.activeTexture);
  const isTransitioning = usePoiInstanceStore(s => s.isTransitioning);
  const activePoi = usePoiInstanceStore(s => s.activePoi);

  // Load both textures upfront (drei caches them automatically)
  const defaultTexture = useTexture(defaultTexturePath);
  const activeTexture = useTexture(activeTexturePath);

  // Configure textures once
  useEffect(() => {
    [defaultTexture, activeTexture].forEach(tex => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
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
