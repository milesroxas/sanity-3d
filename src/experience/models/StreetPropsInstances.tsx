import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

// Updated type to match actual names in JSON file
type StreetPropType =
  | 'traffic-sign-no-entry'
  | 'traffic-lights'
  | 'lamp-road-double'
  | 'lamp-road'
  | 'lamp-city'
  | 'traffic-cone'
  | 'wall-concrete'
  | 'fire-hydrant'
  | 'bus-stop-sign'
  | 'bench-old'
  | 'bus-stop'
  | 'flag-golf_red'
  | 'water-tower-big'
  | 'windmill-base'
  | 'windmill-propeller';

type StreetPropsInstances = ModelInstances & {
  [K in StreetPropType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/street-props.glb';

// Updated mapping for names as they appear in the JSON
const mapBlenderNamesToTypes = (name: string): StreetPropType | null => {
  const baseName = normalizeBlenderName(name);

  const nameMap: Record<string, StreetPropType> = {
    'traffic-sign-no-entry': 'traffic-sign-no-entry',
    'traffic-lights': 'traffic-lights',
    'lamp-road-double': 'lamp-road-double',
    'lamp-road': 'lamp-road',
    'lamp-city': 'lamp-city',
    'traffic-cone': 'traffic-cone',
    'wall-concrete': 'wall-concrete',
    'fire-hydrant': 'fire-hydrant',
    'bus-stop-sign': 'bus-stop-sign',
    'bench-old': 'bench-old',
    'bus-stop': 'bus-stop',
    'flag-golf_red': 'flag-golf_red',
    'water-tower-big': 'water-tower-big',
    'windmill-base': 'windmill-base',
    'windmill-propeller': 'windmill-propeller',
  };

  return nameMap[baseName] || null;
};

// Properly map node names to their types
const mapStreetPropNodes = (nodes: Record<string, THREE.Object3D>) => {
  const result: Record<string, THREE.Object3D> = {};

  // Handle both suffixed and non-suffixed node names
  Object.entries(nodes).forEach(([nodeName, node]) => {
    const baseName = normalizeBlenderName(nodeName);
    const propType = mapBlenderNamesToTypes(baseName);

    if (propType) {
      result[propType] = node;
    }
  });

  return result as Record<StreetPropType, THREE.Object3D>;
};

const StreetPropsInstancing = createModelInstancing<StreetPropsInstances>(
  MODEL_PATH,
  mapStreetPropNodes,
  mapBlenderNamesToTypes
);

export const {
  ModelInstances: StreetPropsInstances,
  useInstances: useStreetPropsInstances,
  InstancesFromBlenderExport: StreetPropsInstances_Blender,
  InstancesFromJSON: StreetPropsInstancesFromJSON,
} = StreetPropsInstancing;
