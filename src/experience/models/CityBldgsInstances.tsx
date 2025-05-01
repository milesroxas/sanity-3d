import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

type CityBldgsType =
  | 'industry-factory-hall'
  | 'building-train-station'
  | 'building-mall'
  | 'building-hotel'
  | 'building-hospital'
  | 'building-cinema'
  | 'building-casino'
  | 'building-carwash'
  | 'industry-warehouse';

type CityBldgsInstances = ModelInstances & {
  [K in CityBldgsType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/city-buildings.glb';

const mapCityBldgsNodes = (nodes: Record<string, THREE.Object3D>) => {
  return {
    'industry-factory-hall': nodes['industry-factory-hall'],
    'building-train-station': nodes['building-train-station'],
    'building-mall': nodes['building-mall'],
    'building-hotel': nodes['building-hotel'],
    'building-hospital': nodes['building-hospital'],
    'building-cinema': nodes['building-cinema'],
    'building-casino': nodes['building-casino'],
    'building-carwash': nodes['building-carwash'],
    'industry-warehouse': nodes['industry-warehouse'],
  };
};

const mapBlenderNamesToTypes = (name: string): CityBldgsType | null => {
  const baseName = normalizeBlenderName(name);

  const nameMap: Record<string, CityBldgsType> = {
    'industry-factory-hall': 'industry-factory-hall',
    'building-train-station': 'building-train-station',
    'building-mall': 'building-mall',
    'building-hotel': 'building-hotel',
    'building-hospital': 'building-hospital',
    'building-cinema': 'building-cinema',
    'building-casino': 'building-casino',
    'building-carwash': 'building-carwash',
    'industry-warehouse': 'industry-warehouse',
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
