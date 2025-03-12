import * as THREE from 'three';

/**
 * Recursively adds shadow properties to all meshes in a model
 * @param object The object to process (group, mesh, etc.)
 * @param castShadow Whether meshes should cast shadows
 * @param receiveShadow Whether meshes should receive shadows
 */
export function addShadowsToModel(
  object: THREE.Object3D, 
  castShadow = true, 
  receiveShadow = true
): void {
  if (object instanceof THREE.Mesh) {
    object.castShadow = castShadow;
    object.receiveShadow = receiveShadow;
    
    // Optimize material for shadow reception if needed
    if (receiveShadow) {
      optimizeMaterialForShadows(object.material);
    }
  }
  
  // Process all children recursively
  object.children.forEach(child => {
    addShadowsToModel(child, castShadow, receiveShadow);
  });
}

/**
 * Adds shadow properties to all meshes in a GLTF model's nodes
 * @param nodes The nodes object from a GLTF model
 * @param castShadow Whether meshes should cast shadows
 * @param receiveShadow Whether meshes should receive shadows
 */
export function addShadowsToGLTFNodes(
  nodes: Record<string, any>,
  castShadow = true,
  receiveShadow = true
): void {
  Object.values(nodes).forEach(node => {
    if (node && node.isMesh) {
      node.castShadow = castShadow;
      node.receiveShadow = receiveShadow;
      
      // Optimize material for shadow reception if needed
      if (receiveShadow) {
        optimizeMaterialForShadows(node.material);
      }
    }
  });
}

/**
 * Optimizes a material to better receive shadows and reduce banding artifacts
 * @param material The material to optimize
 */
export function optimizeMaterialForShadows(material: THREE.Material | THREE.Material[]): void {
  if (!material) return;
  
  // Handle array of materials
  if (Array.isArray(material)) {
    material.forEach(mat => optimizeMaterialForShadows(mat));
    return;
  }
  
  // Ensure the material is properly configured for shadows
  if (material instanceof THREE.MeshPhysicalMaterial || 
      material instanceof THREE.MeshStandardMaterial) {
    
    // Ensure roughness is not too low (very smooth surfaces can have shadow issues)
    if (material.roughness < 0.1) {
      material.roughness = 0.1;
    }
    
    // Ensure metalness is not too high for floor materials
    if (material.metalness > 0.8) {
      material.metalness = 0.8;
    }
    
    // Make sure the material is not transparent (can cause shadow issues)
    if (material.transparent && material.opacity > 0.9) {
      material.transparent = false;
      material.opacity = 1.0;
    }
    
    // Increase flatShading for better shadow reception on flat surfaces
    material.flatShading = false;
    
    // Ensure proper normal calculation to reduce shadow artifacts
    if (material.normalScale) {
      // Don't make normals too strong as it can cause shadow banding
      if (material.normalScale.x > 1) material.normalScale.x = 1;
      if (material.normalScale.y > 1) material.normalScale.y = 1;
    }
  }
  
  // For basic materials, ensure they can receive shadows
  if (material instanceof THREE.MeshBasicMaterial) {
    // Basic materials don't respond to lights, so they need special handling
    material.color.multiplyScalar(0.8); // Darken slightly to make shadows more visible
  }
  
  // For Lambert materials, adjust settings to reduce banding
  if (material instanceof THREE.MeshLambertMaterial) {
    // Lambert materials can show banding in shadows
    material.color.multiplyScalar(0.95); // Slightly darken to improve shadow contrast
  }
  
  // Force material to update
  material.needsUpdate = true;
} 