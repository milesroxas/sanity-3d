import * as THREE from 'three';

/**
 * Utility function to ensure instanced meshes properly cast and receive shadows
 * @param scene The Three.js scene
 */
export function updateInstancedMeshShadows(scene: THREE.Scene): void {
  // Find the directional light to get its shadow settings
  let directionalLight: THREE.DirectionalLight | null = null;
  
  scene.traverse((object) => {
    if (object instanceof THREE.DirectionalLight && object.castShadow) {
      directionalLight = object;
    }
  });
  
  // Traverse the scene and find all instanced meshes
  scene.traverse((object) => {
    if (object instanceof THREE.InstancedMesh) {
      // Ensure instanced meshes have shadow properties set
      object.castShadow = true;
      object.receiveShadow = true;
      
      // Force material update
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => {
            configureMaterialForSoftShadows(mat);
          });
        } else {
          configureMaterialForSoftShadows(object.material);
        }
      }
    } else if (object instanceof THREE.Mesh) {
      // Also check regular meshes to ensure they have proper shadow settings
      if (object.castShadow || object.receiveShadow) {
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => {
              configureMaterialForSoftShadows(mat);
            });
          } else {
            configureMaterialForSoftShadows(object.material);
          }
        }
      }
    }
  });
}

/**
 * Configure a material for better, softer shadows
 * @param material The material to configure
 */
function configureMaterialForSoftShadows(material: THREE.Material): void {
  material.needsUpdate = true;
  
  if (material instanceof THREE.MeshStandardMaterial || 
      material instanceof THREE.MeshPhysicalMaterial) {
    
    // Ensure roughness is not too low for better shadow reception
    if (material.roughness < 0.2) {
      material.roughness = 0.2;
    }
    
    // Adjust metalness for better shadow appearance
    if (material.metalness > 0.7) {
      material.metalness = 0.7;
    }
    
    // Ensure proper normal calculation
    if (material.normalScale) {
      // Don't make normals too strong as it can cause shadow artifacts
      if (material.normalScale.x > 0.8) material.normalScale.x = 0.8;
      if (material.normalScale.y > 0.8) material.normalScale.y = 0.8;
    }
  }
}

/**
 * Sets up a listener to update instanced mesh shadows when needed
 * @param scene The Three.js scene
 */
export function setupInstancedShadowUpdates(scene: THREE.Scene): () => void {
  // Function to handle shadow updates
  const handleShadowUpdate = () => {
    updateInstancedMeshShadows(scene);
  };
  
  // Add event listener
  window.addEventListener('shadow-update', handleShadowUpdate);
  
  // Initial update
  updateInstancedMeshShadows(scene);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('shadow-update', handleShadowUpdate);
  };
} 