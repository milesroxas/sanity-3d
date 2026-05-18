import type { MaterialMap } from '@/experience/types/modelTypes';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// The key for the shared texture atlas used across the entire project
export const SHARED_TEXTURE_KEY = 'LOWPOLY-COLORS';

/** Single source of truth for public-folder atlas URLs */
export const SHARED_ATLAS_TEXTURES = {
  colorMap: '/textures/color-atlas-v6.jpg',
  specularMap: '/textures/color-atlas-specular.png',
  emissionMap: '/textures/color-atlas-emission-night.png',
} as const;

/**
 * Material mode configuration
 * Set to 'textured' to use custom texture atlas
 * Set to 'basic' to use simple untextured materials
 */
export const MATERIAL_MODE: 'textured' | 'basic' = 'textured';

/**
 * Default color to use for basic materials
 * Can be changed to any hex color (e.g., 0xff0000 for red)
 */
export const BASIC_MATERIAL_COLOR = 0xaaaaaa; // Medium gray

/**
 * Color configuration for different object categories
 * Ultra-minimalist palette - very bright, near-white values for PBR rendering
 * Based on color theory: analogous warm neutrals with micro temperature shifts
 */
export const CATEGORY_COLORS = {
  ground: 0xfaf8f5, // Near-white with subtle warmth
  buildings: 0xffffff, // Pure white (main focus, maximum luminosity)
  vehicles: 0xf5f3f0, // Very light warm gray (barely perceptible contrast)
  nature: 0xf8f6f2, // Very light beige with hint of green (almost imperceptible)
  props: 0xfcfaf7, // Near-white warm
  default: 0xfbf9f6, // Near-white neutral warm
};

// Preload the color atlas to avoid loading during render
useTexture.preload(SHARED_ATLAS_TEXTURES.colorMap);

/**
 * Creates a basic untextured material that responds to lighting
 * Optimized for soft, luminous appearance similar to Cycles render
 * @param color Optional color override
 * @param options Additional material options
 */
export function createBasicMaterial(
  color?: number,
  options: Partial<THREE.MeshStandardMaterialParameters> = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: color ?? BASIC_MATERIAL_COLOR,
    roughness: 0.7, // Softer, more reflective than fully matte
    metalness: 0,
    flatShading: false, // Smooth shading for softer appearance
    ...options,
  });
}

/**
 * Creates a material that uses the shared texture atlas
 * @param sourceMaterial The material containing the texture atlas
 * @param options Additional material options
 */
export function createMaterialWithTextureMap(
  sourceMaterial: THREE.Material,
  options: Partial<THREE.MeshStandardMaterialParameters> = {}
): THREE.MeshStandardMaterial {
  // If basic mode is enabled, return a simple untextured material
  if (MATERIAL_MODE === 'basic') {
    return createBasicMaterial(undefined, options);
  }

  // Extract the texture map from source material
  const textureMap = (sourceMaterial as any).map || null;

  // // Determine if source is already a PBR material to extract properties
  // let roughness = 1;
  // let metalness = 0;

  // if (sourceMaterial instanceof THREE.MeshStandardMaterial) {
  //   roughness = sourceMaterial.roughness;
  //   metalness = sourceMaterial.metalness;
  // } else if (sourceMaterial instanceof THREE.MeshPhysicalMaterial) {
  //   roughness = sourceMaterial.roughness;
  //   metalness = sourceMaterial.metalness;
  // }

  // Create a new material with the shared texture map that responds to lighting
  return new THREE.MeshStandardMaterial({
    color: 0xffffff, // White color will show textures as-is
    map: textureMap,
    ...options,
  });
}

/**
 * Creates a material using the project-wide shared texture atlas (LOWPOLY-COLORS)
 * @param materials Materials from GLTF model (optional, used for fallback)
 * @param options Additional material options
 * @param category Optional category for color-coding (e.g., 'ground', 'buildings', 'vehicles')
 */
export function createSharedAtlasMaterial(
  materials?: MaterialMap,
  options: Partial<THREE.MeshStandardMaterialParameters> = {},
  category?: keyof typeof CATEGORY_COLORS
): THREE.MeshStandardMaterial {
  // If basic mode is enabled, return a simple untextured material with category color
  if (MATERIAL_MODE === 'basic') {
    const color = category ? CATEGORY_COLORS[category] : undefined;
    return createBasicMaterial(color, options);
  }

  const colorTexture = useTexture(SHARED_ATLAS_TEXTURES.colorMap);

  // Configure texture settings
  colorTexture.flipY = false;
  colorTexture.colorSpace = THREE.SRGBColorSpace;

  // Create a new material with the external texture
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White color will show textures as-is
    map: colorTexture,
    roughness: 1,
    metalness: 0,
    ...options,
  });

  return material;
}

/**
 * Configures a material for instancing with proper normal handling
 * @param material The material to configure
 * @param options Additional material options
 */
export function configureMaterialForInstancing(
  material: THREE.Material,
  options: Partial<THREE.MeshStandardMaterialParameters> = {}
): THREE.Material {
  if (
    material instanceof THREE.MeshStandardMaterial ||
    material instanceof THREE.MeshPhysicalMaterial
  ) {
    // Ensure proper normal handling
    // material.side = THREE.DoubleSide; // Render both sides to handle flipped normals
    material.transparent = false; // Disable transparency by default
    // material.opacity = 1.0;

    // Preserve existing normal scale if present
    if (material.normalScale) {
      material.normalScale = new THREE.Vector2(
        Math.min(material.normalScale.x, 1.0),
        Math.min(material.normalScale.y, 1.0)
      );
    }

    // Apply any additional options
    Object.assign(material, options);

    material.needsUpdate = true;
  }

  return material;
}
