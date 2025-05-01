import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

// Define the festival model types using a string union
type ScenePropsType =
  | 'tent-war'
  | 'tent-party-big'
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
  | 'celebration-wall-half-big'
  | 'cabin-beach'
  | 'bench-garden'
  | 'board-wire-papers'
  | 'pickleball-court'
  | 'tile-pool-small'
  | 'inflatable-swan-big'
  | 'resort-pool'
  | 'lounger'
  | 'fountain'
  | 'sunscreen-big'
  | 'sunscreen-closed';

// Define the types for festival instances using a mapped type
type ScenePropsInstances = ModelInstances & {
  [K in ScenePropsType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/scene-props.glb';

// Create a single source of truth for model names
const SCENE_PROPS_MODELS: Record<ScenePropsType, ScenePropsType> = {
  'tent-war': 'tent-war',
  'tent-party-big': 'tent-party-big',
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
  'celebration-wall-half-big': 'celebration-wall-half-big',
  'cabin-beach': 'cabin-beach',
  'bench-garden': 'bench-garden',
  'board-wire-papers': 'board-wire-papers',
  'pickleball-court': 'pickleball-court',
  'tile-pool-small': 'tile-pool-small',
  'resort-pool': 'resort-pool',
  fountain: 'fountain',
  lounger: 'lounger',
  'sunscreen-closed': 'sunscreen-closed',
  'inflatable-swan-big': 'inflatable-swan-big',
  'sunscreen-big': 'sunscreen-big',
};

const mapScenePropsNodes = (nodes: Record<string, THREE.Object3D>) => {
  const result: Record<string, THREE.Object3D> = {};

  // Use the keys from FESTIVAL_MODELS to create the mapping
  Object.keys(SCENE_PROPS_MODELS).forEach(key => {
    result[key] = nodes[key];
  });

  return result as Record<ScenePropsType, THREE.Object3D>;
};

const mapBlenderNamesToTypes = (name: string): ScenePropsType | null => {
  // Handle numbered variations using the utility function
  const baseName = normalizeBlenderName(name);

  return (SCENE_PROPS_MODELS as Record<string, ScenePropsType>)[baseName] || null;
};

const ScenePropsInstancing = createModelInstancing(
  MODEL_PATH,
  mapScenePropsNodes,
  mapBlenderNamesToTypes
);

export const {
  ModelInstances: ScenePropsInstances,
  useInstances: useScenePropsInstances,
  InstancesFromBlenderExport: ScenePropsInstances_Blender,
  InstancesFromJSON: ScenePropsInstancesFromJSON,
} = ScenePropsInstancing;
