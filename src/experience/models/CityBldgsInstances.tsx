import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

type CityBldgsType =
  | 'industry-factory-old'
  | 'industry-factory-hall'
  | 'building-train-station'
  | 'building-office-rounded'
  | 'building-office-pyramid'
  | 'building-mall'
  | 'building-hotel'
  | 'building-hospital'
  | 'building-cinema'
  | 'building-casino'
  | 'building-carwash'
  | 'building-block-5floor-front'
  | 'building-block-5floor-corner';

type CityBldgsInstances = ModelInstances & {
  [K in CityBldgsType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/city-buildings.glb';

const mapCityBldgsNodes = (nodes: Record<string, THREE.Object3D>) => {
  return {
    'industry-factory-old': nodes['industry-factory-old'],
    'industry-factory-hall': nodes['industry-factory-hall'],
    'building-train-station': nodes['building-train-station'],
    'building-office-rounded': nodes['building-office-rounded'],
    'building-office-pyramid': nodes['building-office-pyramid'],
    'building-mall': nodes['building-mall'],
    'building-hotel': nodes['building-hotel'],
    'building-hospital': nodes['building-hospital'],
    'building-cinema': nodes['building-cinema'],
    'building-casino': nodes['building-casino'],
    'building-carwash': nodes['building-carwash'],
    'building-block-5floor-front': nodes['building-block-5floor-front'],
    'building-block-5floor-corner': nodes['building-block-5floor-corner'],
  };
};

const mapBlenderNamesToTypes = (name: string): CityBldgsType | null => {
  const baseName = normalizeBlenderName(name);

  const nameMap: Record<string, CityBldgsType> = {
    'industry-factory-old': 'industry-factory-old',
    'industry-factory-hall': 'industry-factory-hall',
    'building-train-station': 'building-train-station',
    'building-office-rounded': 'building-office-rounded',
    'building-office-pyramid': 'building-office-pyramid',
    'building-mall': 'building-mall',
    'building-hotel': 'building-hotel',
    'building-hospital': 'building-hospital',
    'building-cinema': 'building-cinema',
    'building-casino': 'building-casino',
    'building-carwash': 'building-carwash',
    'building-block-5floor-front': 'building-block-5floor-front',
    'building-block-5floor-corner': 'building-block-5floor-corner',
  };

  return nameMap[baseName] || null;
};

const CityBldgsInstancing = createModelInstancing<CityBldgsInstances>(
  MODEL_PATH,
  mapCityBldgsNodes,
  mapBlenderNamesToTypes
);

export const {
  ModelInstances: CityBldgsInstances,
  useInstances: useCityBldgsInstances,
  InstancesFromBlenderExport: CityBldgsInstances_Blender,
} = CityBldgsInstancing;
