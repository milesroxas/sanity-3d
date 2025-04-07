import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

type HouseType =
  | 'industry-building'
  | 'building-house-modern'
  | 'BLDG_House_Small_01'
  | 'BLDG_House_Small_02'
  | 'BLDG_House_Medium_01';

type HousesInstances = ModelInstances & {
  [K in HouseType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/houses.glb';

const mapHousesNodes = (nodes: Record<string, THREE.Object3D>) => {
  return {
    'industry-building': nodes['industry-building'],
    'building-house-modern': nodes['building-house-modern'],
    BLDG_House_Small_01: nodes['BLDG_House_Small_01'],
    BLDG_House_Small_02: nodes['BLDG_House_Small_02'],
    BLDG_House_Medium_01: nodes['BLDG_House_Medium_01'],
  };
};

const mapBlenderNamesToTypes = (name: string): HouseType | null => {
  // Handle numbered variations like industry-building.001
  const baseName = normalizeBlenderName(name);

  // Map of base names to house types
  const nameMap: Record<string, HouseType> = {
    'industry-building': 'industry-building',
    'building-house-modern': 'building-house-modern',
    BLDG_House_Small_01: 'BLDG_House_Small_01',
    BLDG_House_Small_02: 'BLDG_House_Small_02',
    BLDG_House_Medium_01: 'BLDG_House_Medium_01',
  };

  return nameMap[baseName] || null;
};

const HousesInstancing = createModelInstancing<HousesInstances>(
  MODEL_PATH,
  mapHousesNodes,
  mapBlenderNamesToTypes
);

export const {
  ModelInstances: HousesInstances,
  useInstances: useHousesInstances,
  InstancesFromBlenderExport: HousesInstances_Blender,
  InstancesFromJSON: HousesInstancesFromJSON,
} = HousesInstancing;
