import { ThreeEvent } from '@react-three/fiber';
import { ReactElement } from 'react';
import * as THREE from 'three';
import { Vector3Tuple } from 'three';

// Generic interfaces for model instances
export interface ModelInstanceProps {
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
  castShadow?: boolean;
  receiveShadow?: boolean;
  /** Number of instances to create */
  count?: number;
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

/**
 * Props for animated instances that follow a path
 */
export interface AnimatedInstanceProps {
  /** Optional position offset for the instance */
  position?: [number, number, number];
  /** Optional rotation in radians for the instance */
  rotation?: [number, number, number];
  /** Optional scale for the instance */
  scale?: number | [number, number, number];
  /** Optional material override for the instance */
  material?: THREE.Material;
  /** Optional name for the instance */
  name?: string;
  /** Optional user data for the instance */
  userData?: Record<string, any>;
  /** Optional children for the instance */
  children?: React.ReactNode;
  /** Optional callback when the instance is clicked */
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  /** Optional callback when the instance is hovered */
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
  /** Optional callback when the instance is no longer hovered */
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
  /** Optional callback when the instance is moved */
  onPointerMove?: (event: ThreeEvent<PointerEvent>) => void;
  /** Optional callback when the instance is updated */
  onUpdate?: (position: [number, number, number], rotation: [number, number, number]) => void;
  /** Animation configuration for the instance */
  animation?: {
    /** Path points for the instance to follow [x, y, z][] */
    path: [number, number, number][];
    /** Speed of the animation (default: 1) */
    speed?: number;
    /** Whether the animation should loop (default: true) */
    loop?: boolean;
    /** Offset in the path array (0-1) to start the animation from */
    pathOffset?: number;
  };
}
