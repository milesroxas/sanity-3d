import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

/**
 * Define the types of objects available in your model file
 * Use kebab-case to match Blender export names
 */
type GroundType =
  | 'plane'
  | 'tile-road-to-mainroad'
  | 'tile-road-straight'
  | 'tile-road-mainroad-intersection-t'
  | 'tile-road-mainroad-intersection'
  | 'tile-road-intersection-t'
  | 'tile-road-end'
  | 'tile-road-curve'
  | 'tile-plain_sand'
  | 'tile-mainroad-straight'
  | 'tile-mainroad-road-intersection-t'
  | 'tile-mainroad-intersection';

/**
 * Create a type that extends ModelInstances with your specific types
 * This provides type safety when using your instance components
 */
type GroundInstances = ModelInstances & {
  [K in GroundType]: ModelInstanceComponent;
};

// Path to the GLB file containing all models
const MODEL_PATH = '/models/ground.glb';

/**
 * The mapNodes function maps THREE.Object3D objects from the GLB file
 * to your named object types. This is where you handle multi-part models
 * by combining meshes into groups.
 */
const mapGroundNodes = (nodes: Record<string, THREE.Object3D>) => {
  // Return the mapping of type names to Three.js objects
  // These are single-mesh objects that can be mapped directly
  return {
    plane: nodes.plane,
    'tile-road-to-mainroad': nodes['tile-road-to-mainroad'],
    'tile-road-straight': nodes['tile-road-straight'],
    'tile-road-mainroad-intersection-t': nodes['tile-road-mainroad-intersection-t'],
    'tile-road-mainroad-intersection': nodes['tile-road-mainroad-intersection'],
    'tile-road-intersection-t': nodes['tile-road-intersection-t'],
    'tile-road-end': nodes['tile-road-end'],
    'tile-road-curve': nodes['tile-road-curve'],
    'tile-plain_sand': nodes['tile-plain_sand'],
    'tile-mainroad-straight': nodes['tile-mainroad-straight'],
    'tile-mainroad-road-intersection-t': nodes['tile-mainroad-road-intersection-t'],
    'tile-mainroad-intersection': nodes['tile-mainroad-intersection'],
  };
};

/**
 * This function maps Blender object names to our type system
 * It handles variants like 'basic-cube.001', 'basic-cube.002', etc.
 * from Blender to the normalized type 'basic-cube'
 */
const mapBlenderNamesToTypes = (name: string): GroundType | null => {
  // Normalize the name to handle Blender's numbering system (.001, .002, etc.)
  const baseName = normalizeBlenderName(name);

  // Map normalized names to types
  const nameMap: Record<string, GroundType> = {
    plane: 'plane',
    'tile-road-to-mainroad': 'tile-road-to-mainroad',
    'tile-road-straight': 'tile-road-straight',
    'tile-road-mainroad-intersection-t': 'tile-road-mainroad-intersection-t',
    'tile-road-mainroad-intersection': 'tile-road-mainroad-intersection',
    'tile-road-intersection-t': 'tile-road-intersection-t',
    'tile-road-end': 'tile-road-end',
    'tile-road-curve': 'tile-road-curve',
    'tile-plain_sand': 'tile-plain_sand',
    'tile-mainroad-straight': 'tile-mainroad-straight',
    'tile-mainroad-road-intersection-t': 'tile-mainroad-road-intersection-t',
    'tile-mainroad-intersection': 'tile-mainroad-intersection',
  };

  return nameMap[baseName] || null;
};

/**
 * Create the instancing system for this model group
 * This returns several components and hooks for flexible usage
 */
export const GroundInstancing = createModelInstancing<GroundInstances>(
  MODEL_PATH,
  mapGroundNodes,
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
  ModelInstances: GroundInstances,
  useInstances: useGroundInstances,
  InstancesFromBlenderExport: GroundInstances_Blender,
  InstancesFromJSON: GroundInstancesFromJSON,
} = GroundInstancing;
