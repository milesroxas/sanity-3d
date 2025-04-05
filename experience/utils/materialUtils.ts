import * as THREE from 'three';
import type { MaterialMap } from '@/experience/types/modelTypes';

// The key for the shared texture atlas used across the entire project
export const SHARED_TEXTURE_KEY = 'LOWPOLY-COLORS';

/**
 * Creates a material that uses the shared texture atlas
 * @param sourceMaterial The material containing the texture atlas
 * @param options Additional material options
 */
export function createMaterialWithTextureMap(
  sourceMaterial: THREE.Material,
  options: Partial<THREE.MeshBasicMaterialParameters> = {}
): THREE.MeshBasicMaterial {
  // Extract the texture map from source material
  const textureMap = (sourceMaterial as any).map || null;

  // Create a new material with the shared texture map
  return new THREE.MeshBasicMaterial({
    color: 0xffffff, // White color will show textures as-is
    map: textureMap,
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
  options: Partial<THREE.MeshBasicMaterialParameters> = {}
): THREE.MeshBasicMaterial {
  if (!materials[SHARED_TEXTURE_KEY]) {
    console.warn(`Shared texture atlas "${SHARED_TEXTURE_KEY}" not found in materials`);
    return new THREE.MeshBasicMaterial({ color: 0xff00ff, ...options }); // Fallback magenta material
  }
  return createMaterialWithTextureMap(materials[SHARED_TEXTURE_KEY], options);
}
