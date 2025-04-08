/**
 * SampleInstances.tsx
 * This is a comprehensive example of how to create model instances
 * in our performance-optimized 3D system.
 */

import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

/**
 * Define the types of objects available in your model file
 * Use kebab-case to match Blender export names
 */
type SampleType =
  | 'basic-cube'
  | 'multi-part-model'
  | 'textured-sphere'
  | 'custom-material-object'
  | 'animated-prop';

/**
 * Create a type that extends ModelInstances with your specific types
 * This provides type safety when using your instance components
 */
type SampleInstances = ModelInstances & {
  [K in SampleType]: ModelInstanceComponent;
};

// Path to the GLB file containing all models
const MODEL_PATH = '/models/sample-models.glb';

/**
 * The mapNodes function maps THREE.Object3D objects from the GLB file
 * to your named object types. This is where you handle multi-part models
 * by combining meshes into groups.
 */
const mapSampleNodes = (nodes: Record<string, THREE.Object3D>) => {
  // Simple single-mesh objects can be mapped directly
  // They will use shared materials when shared material is enabled

  // For multi-part models, create a group and add all parts to maintain materials
  const multiPartModel = new THREE.Group();

  // Check if the parts exist in the loaded model
  if (
    nodes['multi-part-model_1'] instanceof THREE.Mesh &&
    nodes['multi-part-model_2'] instanceof THREE.Mesh
  ) {
    // Add clones to preserve the original meshes
    multiPartModel.add(nodes['multi-part-model_1'].clone());
    multiPartModel.add(nodes['multi-part-model_2'].clone());

    // Set the same transform as in the original model
    multiPartModel.position.set(0, 0, 0);
    multiPartModel.scale.set(1, 1, 1);
  }

  // Return the mapping of type names to Three.js objects
  return {
    'basic-cube': nodes['basic-cube'],
    'multi-part-model': multiPartModel,
    'textured-sphere': nodes['textured-sphere'],
    'custom-material-object': nodes['custom-material-object'],
    'animated-prop': nodes['animated-prop'],
  };
};

/**
 * This function maps Blender object names to our type system
 * It handles variants like 'basic-cube.001', 'basic-cube.002', etc.
 * from Blender to the normalized type 'basic-cube'
 */
const mapBlenderNamesToTypes = (name: string): SampleType | null => {
  // Normalize the name to handle Blender's numbering system (.001, .002, etc.)
  const baseName = normalizeBlenderName(name);

  // Map normalized names to types
  const nameMap: Record<string, SampleType> = {
    'basic-cube': 'basic-cube',
    'multi-part-model': 'multi-part-model',
    'textured-sphere': 'textured-sphere',
    'custom-material-object': 'custom-material-object',
    'animated-prop': 'animated-prop',
  };

  return nameMap[baseName] || null;
};

/**
 * Create the instancing system for this model group
 * This returns several components and hooks for flexible usage
 */
export const SampleInstancing = createModelInstancing<SampleInstances>(
  MODEL_PATH,
  mapSampleNodes,
  mapBlenderNamesToTypes
);

/**
 * Export the components and hooks for external use
 * - ModelInstances: The main component to wrap instance usage
 * - useInstances: Hook to access typed instance components
 * - InstancesFromBlenderExport: Component to create instances from Blender export data
 * - InstancesFromJSON: Component to create instances from JSON data
 */
export const {
  ModelInstances: SampleInstances,
  useInstances: useSampleInstances,
  InstancesFromBlenderExport: SampleInstances_Blender,
  InstancesFromJSON: SampleInstancesFromJSON,
} = SampleInstancing;

/**
 * USAGE EXAMPLES:
 *
 * 1. Basic usage with shared material (most efficient):
 * ```tsx
 * <SampleInstances>
 *   <SampleInstances_Blender instancesData={blenderData} />
 * </SampleInstances>
 * ```
 *
 * 2. Models with custom materials:
 * ```tsx
 * <SampleInstances useSharedMaterial={false}>
 *   <SampleInstances_Blender instancesData={specialModelsData} />
 * </SampleInstances>
 * ```
 *
 * 3. Programmatic instances with the hook:
 * ```tsx
 * function MyComponent() {
 *   const { BasicCube, TexturedSphere } = useSampleInstances();
 *
 *   return (
 *     <>
 *       <BasicCube position={[0, 0, 0]} />
 *       <TexturedSphere>
 *         <Instance position={[10, 0, 0]} />
 *         <Instance position={[-10, 0, 0]} />
 *       </TexturedSphere>
 *     </>
 *   );
 * }
 * ```
 *
 * 4. Animated instances:
 * ```tsx
 * <BasicCube
 *   animation={{
 *     path: [[0,0,0], [10,0,10], [20,0,0], [10,0,-10]],
 *     speed: 2,
 *     loop: true
 *   }}
 * />
 * ```
 */
