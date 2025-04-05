import * as THREE from 'three';
import { Object3D } from 'three';
import { MeshGLTFModel } from '@/experience/types/modelTypes';

/**
 * Creates an instance of a single mesh from a GLTF model
 * @param nodes The nodes object from the GLTF model
 * @param meshName The name of the mesh to instance
 * @returns A clone of the specific mesh
 */
export function createMeshInstance(
  nodes: Record<string, THREE.Mesh>,
  meshName: string
): THREE.Mesh | null {
  const sourceMesh = nodes[meshName];

  if (!sourceMesh) {
    console.warn(`Mesh "${meshName}" not found in nodes`);
    return null;
  }

  // Create a new mesh with the same geometry and material
  const instancedMesh = new THREE.Mesh(sourceMesh.geometry, sourceMesh.material);

  // Copy basic properties
  instancedMesh.name = `${meshName}-instance`;
  instancedMesh.castShadow = sourceMesh.castShadow;
  instancedMesh.receiveShadow = sourceMesh.receiveShadow;

  return instancedMesh;
}

/**
 * Creates multiple instances of a single mesh with custom positions
 * @param nodes The nodes object from the GLTF model
 * @param meshName The name of the mesh to instance
 * @param positions Array of positions for each instance
 * @param parent Optional parent group to add instances to
 * @returns Group containing all instances or array of meshes
 */
export function createMultipleMeshInstances(
  nodes: Record<string, THREE.Mesh>,
  meshName: string,
  positions: THREE.Vector3[] | [number, number, number][],
  parent?: THREE.Group
): THREE.Group | THREE.Mesh[] {
  const sourceMesh = nodes[meshName];

  if (!sourceMesh) {
    console.warn(`Mesh "${meshName}" not found in nodes`);
    return parent || new THREE.Group();
  }

  const instances: THREE.Mesh[] = [];
  const container = parent || new THREE.Group();

  positions.forEach((position, index) => {
    // Create instance
    const instance = createMeshInstance(nodes, meshName);

    if (instance) {
      // Set position
      if (position instanceof THREE.Vector3) {
        instance.position.copy(position);
      } else {
        instance.position.set(position[0], position[1], position[2]);
      }

      // Set name with index
      instance.name = `${meshName}-instance-${index}`;

      // Add to container if parent was provided
      if (parent) {
        container.add(instance);
      }

      instances.push(instance);
    }
  });

  return parent ? container : instances;
}
