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
  | 'car-sedan-white'
  | 'car-sedan-red'
  | 'car-sedan-blue'
  | 'car-sedan-gray'
  | 'camper'
  | 'patrol-car'
  | 'plane-passenger'
  | 'car-caravan-big-standing'
  | 'car-camper-bus-standing';

type VehiclesInstances = ModelInstances & {
  [K in VehicleType]: ModelInstanceComponent;
};

const MODEL_PATH = '/models/vehicles.glb';

const mapVehiclesNodes = (nodes: Record<string, THREE.Object3D>) => {
  // Create a group for the patrol car
  const patrolCar = new THREE.Group();

  // Check if the individual parts exist
  if (nodes['patrol-car_1'] instanceof THREE.Mesh && nodes['patrol-car_2'] instanceof THREE.Mesh) {
    // Add clones to preserve the original meshes
    patrolCar.add(nodes['patrol-car_1'].clone());
    patrolCar.add(nodes['patrol-car_2'].clone());

    // Set the same transform as in the original model
    patrolCar.position.set(-20.532, 0, 0);
    patrolCar.scale.set(1.317, 1.317, 1.317);
  }

  return {
    'city-bus': nodes['city-bus'],
    'camping-van': nodes['camping-van'],
    truck: nodes.truck,
    taxi: nodes.taxi,
    'hippie-van': nodes['hippie-van'],
    'cement-truck': nodes['cement-truck'],
    jeep: nodes.jeep,
    'car-sedan-white': nodes['car-sedan-white'],
    'car-sedan-red': nodes['car-sedan-red'],
    'car-sedan-blue': nodes['car-sedan-blue'],
    'car-sedan-gray': nodes['car-sedan-gray'],
    camper: nodes.camper,
    'patrol-car': patrolCar,
    'plane-passenger': nodes['plane-passenger'],
    'car-caravan-big-standing': nodes['car-caravan-big-standing'],
    'car-camper-bus-standing': nodes['car-camper-bus-standing'],
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
    'car-sedan-white': 'car-sedan-white',
    'car-sedan-red': 'car-sedan-red',
    'car-sedan-blue': 'car-sedan-blue',
    'car-sedan-gray': 'car-sedan-gray',
    camper: 'camper',
    'patrol-car': 'patrol-car',
    'plane-passenger': 'plane-passenger',
    'car-caravan-big-standing': 'car-caravan-big-standing',
    'car-camper-bus-standing': 'car-camper-bus-standing',
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
