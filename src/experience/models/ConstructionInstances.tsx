import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

type ConstructionType =
  | 'planks-stack'
  | 'pipe-concrete-stack'
  | 'crane-tower'
  | 'contruction-small'
  | 'contruction-large';

type ConstructionInstances = ModelInstances & {
  [K in ConstructionType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/construction.glb';

const mapConstructionNodes = (nodes: Record<string, THREE.Object3D>) => {
  return {
    'planks-stack': nodes['planks-stack'],
    'pipe-concrete-stack': nodes['pipe-concrete-stack'],
    'crane-tower': nodes['crane-tower'],
    'contruction-small': nodes['contruction-small'],
    'contruction-large': nodes['contruction-large'],
  };
};

const mapBlenderNamesToTypes = (name: string): ConstructionType | null => {
  const baseName = normalizeBlenderName(name);

  const nameMap: Record<string, ConstructionType> = {
    'planks-stack': 'planks-stack',
    'pipe-concrete-stack': 'pipe-concrete-stack',
    'crane-tower': 'crane-tower',
    'contruction-small': 'contruction-small',
    'contruction-large': 'contruction-large',
  };

  return nameMap[baseName] || null;
};

const ConstructionInstancing = createModelInstancing<ConstructionInstances>(
  MODEL_PATH,
  mapConstructionNodes,
  mapBlenderNamesToTypes
);

export const {
  ModelInstances: ConstructionInstances,
  useInstances: useConstructionInstances,
  InstancesFromBlenderExport: ConstructionInstances_Blender,
} = ConstructionInstancing;
