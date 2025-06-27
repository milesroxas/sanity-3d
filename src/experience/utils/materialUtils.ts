import type { MaterialMap } from '@/experience/types/modelTypes';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// The key for the shared texture atlas used across the entire project
export const SHARED_TEXTURE_KEY = 'LOWPOLY-COLORS';

// Preload the textures to avoid loading during render
useTexture.preload('/textures/color-atlas-new2.png');
useTexture.preload('/textures/color-atlas-specular.png');
useTexture.preload('/textures/color-atlas-emission-night.png');

/**
 * Creates a material that uses the shared texture atlas
 * @param sourceMaterial The material containing the texture atlas
 * @param options Additional material options
 */
export function createMaterialWithTextureMap(
  sourceMaterial: THREE.Material,
  options: Partial<THREE.MeshStandardMaterialParameters> = {}
): THREE.MeshStandardMaterial {
  // Extract the texture map from source material
  const textureMap = (sourceMaterial as any).map || null;

  // Determine if source is already a PBR material to extract properties
  let roughness = 1;
  let metalness = 0;

  if (sourceMaterial instanceof THREE.MeshStandardMaterial) {
    roughness = sourceMaterial.roughness;
    metalness = sourceMaterial.metalness;
  } else if (sourceMaterial instanceof THREE.MeshPhysicalMaterial) {
    roughness = sourceMaterial.roughness;
    metalness = sourceMaterial.metalness;
  }

  // Create a new material with the shared texture map that responds to lighting
  return new THREE.MeshStandardMaterial({
    color: 0xffffff, // White color will show textures as-is
    map: textureMap,
    roughness: roughness,
    metalness: metalness,
    envMapIntensity: 1.0,
    ...options,
  });
}

/**
 * Creates a material using the project-wide shared texture atlas (LOWPOLY-COLORS)
 * @param materials Materials from GLTF model
 * @param options Additional material options
 */
export function createSharedAtlasMaterial(
  materials: MaterialMap,
  options: Partial<THREE.MeshStandardMaterialParameters> = {}
): THREE.MeshStandardMaterial {
  if (!materials[SHARED_TEXTURE_KEY]) {
    console.warn(`Shared texture atlas "${SHARED_TEXTURE_KEY}" not found in materials`);
    return new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      roughness: 1, // Higher default roughness
      metalness: 0, // Lower default metalness
      envMapIntensity: 0, // Lower environment map intensity
      ...options,
    }); // Fallback magenta material
  }

  // Create material with texture map and non-reflective defaults
  const material = createMaterialWithTextureMap(materials[SHARED_TEXTURE_KEY], {
    roughness: 1,
    metalness: 0,
    envMapIntensity: 0,
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
    material.side = THREE.DoubleSide; // Render both sides to handle flipped normals
    material.transparent = false; // Disable transparency by default
    material.opacity = 1.0;

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
