import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstanceComponent, ModelInstances } from '@/experience/baseModels/shared/types';
import { normalizeBlenderName } from '@/experience/utils/modelUtils';
import * as THREE from 'three';

type VehicleType =
  | 'city-bus'
  | 'camping-van'
  | 'truck'
  | 'taxi'
  | 'hippie-van'
  | 'cement-truck'
  | 'jeep'
  | 'car-sedan'
  | 'camper'
  | 'patrol-car';

type VehiclesInstances = ModelInstances & {
  [K in VehicleType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/vehicles.glb';

const mapVehiclesNodes = (nodes: Record<string, THREE.Object3D>) => {
  return {
    'city-bus': nodes['city-bus'],
    'camping-van': nodes['camping-van'],
    truck: nodes.truck,
    taxi: nodes.taxi,
    'hippie-van': nodes['hippie-van'],
    'cement-truck': nodes['cement-truck'],
    jeep: nodes.jeep,
    'car-sedan': nodes['car-sedan'],
    camper: nodes.camper,
    'patrol-car': nodes['patrol-car'],
  };
};

const mapBlenderNamesToTypes = (name: string): VehicleType | null => {
  const baseName = normalizeBlenderName(name);

  const nameMap: Record<string, VehicleType> = {
    'city-bus': 'city-bus',
    'camping-van': 'camping-van',
    truck: 'truck',
    taxi: 'taxi',
    'hippie-van': 'hippie-van',
    'cement-truck': 'cement-truck',
    jeep: 'jeep',
    'car-sedan': 'car-sedan',
    camper: 'camper',
    'patrol-car': 'patrol-car',
  };

  return nameMap[baseName] || null;
};

export const VehiclesInstancing = createModelInstancing<VehiclesInstances>(
  MODEL_PATH,
  mapVehiclesNodes,
  mapBlenderNamesToTypes
);

export const {
  ModelInstances: VehiclesInstances,
  useInstances: useVehiclesInstances,
  InstancesFromBlenderExport: VehiclesInstances_Blender,
  InstancesFromJSON: VehiclesInstancesFromJSON,
} = VehiclesInstancing;
