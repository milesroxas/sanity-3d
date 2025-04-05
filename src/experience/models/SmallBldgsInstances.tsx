import * as THREE from 'three';
import React from 'react';
import { createModelInstancing } from '@/experience/baseModels/shared/createModelInstances';
import { ModelInstances, ModelInstanceComponent } from '@/experience/baseModels/shared/types';
import { MeshGLTFModel } from '@/experience/types/modelTypes';

// Define the building types using a string union
type SmallBldgType =
  | 'BurgerJoint'
  | 'Restaurant1'
  | 'Restaurant2'
  | 'CornerStore'
  | 'Shop'
  | 'Cannabis';

// Define the types for building instances using a mapped type from the union
type SmallBldgsInstances = ModelInstances & {
  [K in SmallBldgType]: ModelInstanceComponent;
};

// Define the model path
const MODEL_PATH = '/models/small-buildings.glb';

// Define the mapping function for building nodes
const mapSmallBldgsNodes = (nodes: Record<string, THREE.Object3D>) => {
  // Simply map the nodes directly - materials are already set up in the base model
  return {
    BurgerJoint: nodes['building-burger-joint'],
    Restaurant1: nodes['building-restaurant-1'],
    Restaurant2: nodes['building-restaurant-2'],
    CornerStore: nodes['building-corner-store'],
    Shop: nodes['build-shop-1'],
    Cannabis: nodes['building-cannabis'],
  };
};

// Define the name mapping function for Blender exports
const mapBlenderNamesToTypes = (name: string): SmallBldgType | null => {
  // Handle numbered variations like building-restaurant-2.004
  const baseName = name.replace(/\.\d+$/, '');

  const nameMap: Record<string, SmallBldgType> = {
    'building-burger-joint': 'BurgerJoint',
    'building-restaurant-1': 'Restaurant1',
    'building-restaurant-2': 'Restaurant2',
    'building-corner-store': 'CornerStore',
    'build-shop-1': 'Shop',
    'building-cannabis': 'Cannabis',
  };

  return nameMap[baseName] || null;
};

// Create the building instancing system
const SmallBldgsInstancing = createModelInstancing<SmallBldgsInstances>(
  MODEL_PATH,
  mapSmallBldgsNodes,
  mapBlenderNamesToTypes
);

// Export the components and hook with simplified naming
export const {
  ModelInstances: SmallBldgsInstances,
  useInstances: useSmallBldgsInstances,
  InstancesFromBlenderExport: SmallBldgsInstances_Blender,
  InstancesFromJSON: SmallBldgsInstancesFromJSON,
} = SmallBldgsInstancing;
