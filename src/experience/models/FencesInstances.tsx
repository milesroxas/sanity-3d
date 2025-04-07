import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

// Define the fence types using a string union
type FenceType =
  | 'shrub-flowers'
  | 'house-wall-wood-green-2x3m'
  | 'house-wall-wood-2x3m'
  | 'flowers-window'
  | 'fence-vineyard'
  | 'fence-stone-metal'
  | 'fence-shrub'
  | 'fence-big'
  | 'fence-picket';

// Define the types for fence instances using a mapped type
type FencesInstances = ModelInstances & {
  [K in FenceType]: ModelInstanceComponent;
};

// Define the model path
const MODEL_PATH = '/models/fences.glb';

// Define the mapping function for fence nodes
const mapFencesNodes = (nodes: Record<string, THREE.Object3D>) => {
  return {
    'shrub-flowers': nodes['shrub-flowers'],
    'house-wall-wood-green-2x3m':
      nodes['house-wall-wood-green-2x3m001'] || nodes['house-wall-wood-green-2x3m'],
    'house-wall-wood-2x3m': nodes['house-wall-wood-2x3m'],
    'flowers-window': nodes['flowers-window001'] || nodes['flowers-window'],
    'fence-vineyard': nodes['fence-vineyard'],
    'fence-stone-metal': nodes['fence-stone-metal'],
    'fence-shrub': nodes['fence-shrub'],
    'fence-big': nodes['fence-big'],
    'fence-picket': nodes['fence-picket'],
  };
};

// Define the name mapping function for Blender exports
const mapBlenderNamesToTypes = (name: string): FenceType | null => {
  // Handle numbered variations with dot notation using the utility function
  const baseName = normalizeBlenderName(name);

  // Map of base names to fence types
  const nameMap: Record<string, FenceType> = {
    'shrub-flowers': 'shrub-flowers',
    'house-wall-wood-green-2x3m': 'house-wall-wood-green-2x3m',
    'house-wall-wood-2x3m': 'house-wall-wood-2x3m',
    'flowers-window': 'flowers-window',
    'fence-vineyard': 'fence-vineyard',
    'fence-stone-metal': 'fence-stone-metal',
    'fence-shrub': 'fence-shrub',
    'fence-big': 'fence-big',
    'fence-picket': 'fence-picket',
  };

  return nameMap[baseName] || null;
};

// Create the fence instancing system
const FencesInstancing = createModelInstancing<FencesInstances>(
  MODEL_PATH,
  mapFencesNodes,
  mapBlenderNamesToTypes
);

// Export the components and hook with simplified naming
export const {
  ModelInstances: FencesInstances,
  useInstances: useFencesInstances,
  InstancesFromBlenderExport: FencesInstances_Blender,
  InstancesFromJSON: FencesInstancesFromJSON,
} = FencesInstancing;
