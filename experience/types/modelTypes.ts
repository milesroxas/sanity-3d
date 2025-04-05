import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

// Instead of namespace, declare module augmentation
declare module 'react' {
  interface IntrinsicElements {
    group: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    mesh: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

export type MergedInstancesType<T> =
  | {
      [K in keyof T]: THREE.Mesh;
    }
  | null;

export type BaseInstancesProps = {
  children: React.ReactNode;
};

export type MaterialType = {
  [key: string]: THREE.Material;
};

export type NodesType = {
  [key: string]: THREE.Mesh;
};

export type GroupType = {
  [key: string]: THREE.Group;
};

/**
 * Standard ObjectMap type as per drei documentation
 */
export type ObjectMap = {
  nodes: {
    [name: string]: THREE.Object3D;
  };
  materials: {
    [name: string]: THREE.Material;
  };
};

/**
 * Base GLTF model type with simplified structure
 * Use this as a base for extending with specific model types
 */
export type GLTFModel = GLTF & ObjectMap;

/**
 * Simplified model type when all nodes are meshes
 * Use this for most models where you don't need specific typing
 */
export type MeshGLTFModel = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

/**
 * Type for materials used in models
 */
export type MaterialMap = Record<string, THREE.Material>;
