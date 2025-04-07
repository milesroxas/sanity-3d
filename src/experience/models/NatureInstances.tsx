import * as THREE from 'three';
import { createModelInstancing } from '../baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '../baseModels/shared/types';
import { normalizeBlenderName } from '../utils/modelUtils';

type NatureType =
  | 'stone-medium-flat'
  | 'stone-flat'
  | 'shrub-flowers'
  | 'scifi-pot-low-palm'
  | 'scifi-pot-big-plant'
  | 'rock-sharp'
  | 'rock-large'
  | 'plant-bush-small'
  | 'palm-small'
  | 'palm-high'
  | 'palm-bush-big'
  | 'palm-big'
  | 'grass-tall'
  | 'grass'
  | 'flower-poisonous'
  | 'cactus-medium'
  | 'cactus-big'
  | 'cactus-basic'
  | 'bush-medium-high'
  | 'bush-medium'
  | 'bush-big';

type NatureInstances = ModelInstances & {
  [K in NatureType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/nature-props.glb';

// Create a mapping of types to node names
const NATURE_MODELS: Record<NatureType, string> = {
  'stone-medium-flat': 'stone-medium-flat',
  'stone-flat': 'stone-flat',
  'shrub-flowers': 'shrub-flowers',
  'scifi-pot-low-palm': 'scifi-pot-low-palm',
  'scifi-pot-big-plant': 'scifi-pot-big-plant',
  'rock-sharp': 'rock-sharp',
  'rock-large': 'rock-large',
  'plant-bush-small': 'plant-bush-small',
  'palm-small': 'palm-small',
  'palm-high': 'palm-high',
  'palm-bush-big': 'palm-bush-big',
  'palm-big': 'palm-big',
  'grass-tall': 'grass-tall',
  grass: 'grass',
  'flower-poisonous': 'flower-poisonous',
  'cactus-medium': 'cactus-medium',
  'cactus-big': 'cactus-big',
  'cactus-basic': 'cactus-basic',
  'bush-medium-high': 'bush-medium-high',
  'bush-medium': 'bush-medium',
  'bush-big': 'bush-big',
};

// Define the mapping function for nature prop nodes
const mapNatureNodes = (nodes: Record<string, THREE.Object3D>) => {
  const result: Record<string, THREE.Object3D> = {};

  // Map each type to its corresponding node
  Object.entries(NATURE_MODELS).forEach(([typeName, nodeName]) => {
    if (nodes[nodeName]) {
      result[typeName] = nodes[nodeName];
    }
  });

  return result as Record<NatureType, THREE.Object3D>;
};

// Define the name mapping function for Blender exports
const mapBlenderNamesToTypes = (name: string): NatureType | null => {
  // Handle numbered variations (eg: bush-medium.001)
  const baseName = normalizeBlenderName(name);

  // Check if the base name matches any of our defined types
  return NATURE_MODELS[baseName as NatureType] ? (baseName as NatureType) : null;
};

// Create the nature instancing system
const NatureInstancing = createModelInstancing<NatureInstances>(
  MODEL_PATH,
  mapNatureNodes,
  mapBlenderNamesToTypes
);

// Export the components and hook with simplified naming
export const {
  ModelInstances: NatureInstances,
  useInstances: useNatureInstances,
  InstancesFromBlenderExport: NatureInstances_Blender,
  InstancesFromJSON: NatureInstancesFromJSON,
} = NatureInstancing;
