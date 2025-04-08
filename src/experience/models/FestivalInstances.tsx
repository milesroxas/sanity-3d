import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

// Define the festival model types using a string union
type FestivalType =
  | 'tent-war'
  | 'tent-party-big'
  | 'tent-party'
  | 'tent-party-blue'
  | 'tent-party-cyan'
  | 'tent-party-orange'
  | 'tent-party-purple'
  | 'sunscreen'
  | 'stand-ice-cream'
  | 'stage-truss'
  | 'stage-platform-stairs-medium'
  | 'stage-platform-medium'
  | 'stage-platform-big'
  | 'scifi-tree-orb-big'
  | 'scifi-tree-mushroom-big'
  | 'scifi-projection-g'
  | 'scifi-projection-f'
  | 'scifi-projection-d'
  | 'scifi-pot-low-palm'
  | 'lights-string'
  | 'information-stall-blue'
  | 'information-stall-purple'
  | 'information-stall-red'
  | 'information-stall-green'
  | 'hot-dog-stand'
  | 'fireplace'
  | 'coffee-stall'
  | 'celebration-wall-half-big'
  | 'cabin-beach'
  | 'bench-garden'
  | 'board-wire-papers';

// Define the types for festival instances using a mapped type
type FestivalInstances = ModelInstances & {
  [K in FestivalType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/festival-models.glb';

// Create a single source of truth for model names
const FESTIVAL_MODELS: Record<FestivalType, FestivalType> = {
  'tent-war': 'tent-war',
  'tent-party-big': 'tent-party-big',
  'tent-party': 'tent-party',
  'tent-party-blue': 'tent-party-blue',
  'tent-party-cyan': 'tent-party-cyan',
  'tent-party-orange': 'tent-party-orange',
  'tent-party-purple': 'tent-party-purple',
  sunscreen: 'sunscreen',
  'stand-ice-cream': 'stand-ice-cream',
  'stage-truss': 'stage-truss',
  'stage-platform-stairs-medium': 'stage-platform-stairs-medium',
  'stage-platform-medium': 'stage-platform-medium',
  'stage-platform-big': 'stage-platform-big',
  'scifi-tree-orb-big': 'scifi-tree-orb-big',
  'scifi-tree-mushroom-big': 'scifi-tree-mushroom-big',
  'scifi-projection-g': 'scifi-projection-g',
  'scifi-projection-f': 'scifi-projection-f',
  'scifi-projection-d': 'scifi-projection-d',
  'scifi-pot-low-palm': 'scifi-pot-low-palm',
  'lights-string': 'lights-string',
  'information-stall-blue': 'information-stall-blue',
  'information-stall-purple': 'information-stall-purple',
  'information-stall-red': 'information-stall-red',
  'information-stall-green': 'information-stall-green',
  'hot-dog-stand': 'hot-dog-stand',
  fireplace: 'fireplace',
  'coffee-stall': 'coffee-stall',
  'celebration-wall-half-big': 'celebration-wall-half-big',
  'cabin-beach': 'cabin-beach',
  'bench-garden': 'bench-garden',
  'board-wire-papers': 'board-wire-papers',
};

const mapFestivalNodes = (nodes: Record<string, THREE.Object3D>) => {
  const result: Record<string, THREE.Object3D> = {};

  // Use the keys from FESTIVAL_MODELS to create the mapping
  Object.keys(FESTIVAL_MODELS).forEach(key => {
    result[key] = nodes[key];
  });

  return result as Record<FestivalType, THREE.Object3D>;
};

const mapBlenderNamesToTypes = (name: string): FestivalType | null => {
  // Handle numbered variations using the utility function
  const baseName = normalizeBlenderName(name);

  return (FESTIVAL_MODELS as Record<string, FestivalType>)[baseName] || null;
};

const FestivalInstancing = createModelInstancing(
  MODEL_PATH,
  mapFestivalNodes,
  mapBlenderNamesToTypes
);

export const {
  ModelInstances: FestivalInstances,
  useInstances: useFestivalInstances,
  InstancesFromBlenderExport: FestivalInstances_Blender,
  InstancesFromJSON: FestivalInstancesFromJSON,
} = FestivalInstancing;
