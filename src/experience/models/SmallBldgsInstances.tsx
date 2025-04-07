import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

// Define the building types using a string union
type SmallBldgType =
  | 'BurgerJoint'
  | 'Restaurant1'
  | 'Restaurant2'
  | 'CornerStore'
  | 'Shop'
  | 'Cannabis';

// Define the types for building instances using a mapped type from the union
type SmallBldgsInstances = ModelInstances & {
  [K in SmallBldgType]: ModelInstanceComponent;
};

// Define the model path
const MODEL_PATH = '/models/small-buildings.glb';

// Create a single source of truth for model names and their node mappings
const SMALL_BLDG_MODELS: Record<SmallBldgType, string> = {
  BurgerJoint: 'building-burger-joint',
  Restaurant1: 'building-restaurant-1',
  Restaurant2: 'building-restaurant-2',
  CornerStore: 'building-corner-store',
  Shop: 'build-shop-1',
  Cannabis: 'building-cannabis',
};

// Define the mapping function for building nodes
const mapSmallBldgsNodes = (nodes: Record<string, THREE.Object3D>) => {
  const result: Record<string, THREE.Object3D> = {};

  // Use the SMALL_BLDG_MODELS mapping to create the node mapping
  Object.entries(SMALL_BLDG_MODELS).forEach(([key, nodeName]) => {
    result[key] = nodes[nodeName];
  });

  return result as Record<SmallBldgType, THREE.Object3D>;
};

// Define the name mapping function for Blender exports
const mapBlenderNamesToTypes = (name: string): SmallBldgType | null => {
  // Handle numbered variations like building-restaurant-2.004 using the utility function
  const baseName = normalizeBlenderName(name);

  // Reverse lookup from node names to types
  for (const [type, nodeName] of Object.entries(SMALL_BLDG_MODELS)) {
    if (nodeName === baseName) {
      return type as SmallBldgType;
    }
  }

  return null;
};

// Create the building instancing system
const SmallBldgsInstancing = createModelInstancing<SmallBldgsInstances>(
  MODEL_PATH,
  mapSmallBldgsNodes,
  mapBlenderNamesToTypes
);

// Export the components and hook with simplified naming
export const {
  ModelInstances: SmallBldgsInstances,
  useInstances: useSmallBldgsInstances,
  InstancesFromBlenderExport: SmallBldgsInstances_Blender,
  InstancesFromJSON: SmallBldgsInstancesFromJSON,
} = SmallBldgsInstancing;
