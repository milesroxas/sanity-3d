import { ReactElement } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { Vector3Tuple } from 'three';

// Generic interfaces for model instances
export interface ModelInstanceProps {
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
  castShadow?: boolean;
  receiveShadow?: boolean;
  [key: string]: any;
}

// Generic type for model instance components
export type ModelInstanceComponent = (props?: ModelInstanceProps) => ReactElement;

// Generic type for model instances
export interface ModelInstances {
  [key: string]: ModelInstanceComponent;
}

// Generic interface for instance data in JSON files - our standard format
export interface ModelInstanceData {
  type: string;
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
  [key: string]: any;
}

// Interface for Blender-exported format
export interface BlenderExportData {
  name: string;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
  [key: string]: any;
}
