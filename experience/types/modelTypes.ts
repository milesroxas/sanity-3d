import type * as THREE from "three";

// Instead of namespace, declare module augmentation
declare module "react" {
  interface IntrinsicElements {
    group: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
    mesh: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
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
