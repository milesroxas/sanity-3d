import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

type MountainType = 'TerrainMountains';

type MountainInstances = ModelInstances & {
  [K in MountainType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/mountain.glb';

const MOUNTAIN_MODELS: Record<MountainType, string> = {
  TerrainMountains: 'terrain-mountains',
};

// Define the mapping function for mountain nodes
const mapMountainNodes = (nodes: Record<string, THREE.Object3D>) => {
  const result: Record<string, THREE.Object3D> = {};

  // Use the MOUNTAIN_MODELS mapping to create the node mapping
  Object.entries(MOUNTAIN_MODELS).forEach(([key, nodeName]) => {
    result[key] = nodes[nodeName];
  });

  return result as Record<MountainType, THREE.Object3D>;
};

// Define the name mapping function for Blender exports
const mapBlenderNamesToTypes = (name: string): MountainType | null => {
  // Handle numbered variations like terrain-mountains.001
  const baseName = normalizeBlenderName(name);

  // Reverse lookup from node names to types
  for (const [type, nodeName] of Object.entries(MOUNTAIN_MODELS)) {
    if (nodeName === baseName) {
      return type as MountainType;
    }
  }

  return null;
};

// Create the mountain instancing system
const MountainInstancing = createModelInstancing<MountainInstances>(
  MODEL_PATH,
  mapMountainNodes,
  mapBlenderNamesToTypes
);

// Export the components and hook with simplified naming
export const {
  ModelInstances: MountainInstances,
  useInstances: useMountainInstances,
  InstancesFromBlenderExport: MountainInstances_Blender,
  InstancesFromJSON: MountainInstancesFromJSON,
} = MountainInstancing;
