import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import React, { createContext, useContext, useMemo } from 'react';
import { ThreeElements } from '@react-three/fiber';

// Basic car colors
export const carColors = {
  red: new THREE.MeshPhysicalMaterial({
    color: '#ff0000',
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
  }),
  green: new THREE.MeshPhysicalMaterial({
    color: '#00ff00',
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
  }),
  beige: new THREE.MeshPhysicalMaterial({
    color: '#f5f5dc',
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
  }),
  blue: new THREE.MeshPhysicalMaterial({
    color: '#0000ff',
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
  }),
  white: new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
  }),
  black: new THREE.MeshPhysicalMaterial({
    color: '#000000',
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
  }),
};

// Basic materials for car parts
export const carPartMaterials = {
  headlights: new THREE.MeshBasicMaterial({
    color: '#ffffff',
  }),
};

export type CarColor = keyof typeof carColors;

export type CarProps = ThreeElements['group'] & { color?: CarColor };

type CarInstancesType = {
  Car: (props: CarProps) => React.ReactNode;
};

type GLTFResult = GLTF & {
  nodes: {
    ['car-passenger-base001']: THREE.Mesh;
    ['car-passenger-base001_1']: THREE.Mesh;
    ['car-passenger-base001_2']: THREE.Mesh;
    ['car-passenger-base001_3']: THREE.Mesh;
    ['car-passenger-base001_4']: THREE.Mesh;
    ['car-passenger-base001_5']: THREE.Mesh;
    ['car-passenger-wheel_BL001']: THREE.Mesh;
    ['car-passenger-wheel_BL001_1']: THREE.Mesh;
    ['car-passenger-wheel_BR001']: THREE.Mesh;
    ['car-passenger-wheel_BR001_1']: THREE.Mesh;
    ['car-passenger-wheel_FL001']: THREE.Mesh;
    ['car-passenger-wheel_FL001_1']: THREE.Mesh;
    ['car-passenger-wheel_FR_1']: THREE.Mesh;
    ['car-passenger-wheel_FR_2']: THREE.Mesh;
  };
  materials: {
    ['23 GREY-WHITE.001']: THREE.MeshPhysicalMaterial;
    ['64 GLASS.002']: THREE.MeshPhysicalMaterial;
    ['17 GREY-DARKEST.002']: THREE.MeshPhysicalMaterial;
    Head_Lights: THREE.MeshPhysicalMaterial;
    ['57 BLACK.001']: THREE.MeshPhysicalMaterial;
    Tail_Light: THREE.MeshPhysicalMaterial;
    ['20 GREY.002']: THREE.MeshPhysicalMaterial;
  };
};

const context = createContext<CarInstancesType | null>(null);

export type CarPosition = {
  position: [number, number, number];
  rotation: [number, number, number];
  color: CarColor;
};

export function Car({
  position,
  rotation,
  color = 'white',
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: CarColor;
}) {
  const instances = useContext(context);
  if (!instances) return null;

  return <instances.Car position={position} rotation={rotation} color={color} />;
}

export function Instances({ children }: { children: React.ReactNode }) {
  const { nodes } = useGLTF('/models/vehicles_car_1.glb') as unknown as GLTFResult;

  const Car = useMemo(() => {
    return function Car(props?: ThreeElements['group'] & { color?: CarColor }) {
      const material = carColors[props?.color || 'white'];

      return (
        <group {...props}>
          <group name="car-passenger">
            <group name="car-passenger-base">
              <mesh geometry={nodes['car-passenger-base001'].geometry} material={material} />
              <mesh
                geometry={nodes['car-passenger-base001_1'].geometry}
                material={nodes['car-passenger-base001_2'].material}
              />
              <mesh
                geometry={nodes['car-passenger-base001_2'].geometry}
                material={nodes['car-passenger-base001_2'].material}
              />
              <mesh
                geometry={nodes['car-passenger-base001_3'].geometry}
                material={nodes['car-passenger-base001_2'].material}
              />
              <mesh
                geometry={nodes['car-passenger-base001_4'].geometry}
                material={nodes['car-passenger-base001_4'].material}
              />
              <mesh
                geometry={nodes['car-passenger-base001_5'].geometry}
                material={nodes['car-passenger-base001_5'].material}
              />
            </group>
            <group name="car-passenger-wheels">
              <mesh
                geometry={nodes['car-passenger-wheel_BL001'].geometry}
                material={nodes['car-passenger-wheel_BL001'].material}
              />
              <mesh
                geometry={nodes['car-passenger-wheel_BL001_1'].geometry}
                material={nodes['car-passenger-wheel_BL001_1'].material}
              />
              <mesh
                geometry={nodes['car-passenger-wheel_BR001'].geometry}
                material={nodes['car-passenger-wheel_BR001'].material}
              />
              <mesh
                geometry={nodes['car-passenger-wheel_BR001_1'].geometry}
                material={nodes['car-passenger-wheel_BR001_1'].material}
              />
              <mesh
                geometry={nodes['car-passenger-wheel_FL001'].geometry}
                material={nodes['car-passenger-wheel_FL001'].material}
              />
              <mesh
                geometry={nodes['car-passenger-wheel_FL001_1'].geometry}
                material={nodes['car-passenger-wheel_FL001_1'].material}
              />
              <mesh
                geometry={nodes['car-passenger-wheel_FR_1'].geometry}
                material={nodes['car-passenger-wheel_FR_1'].material}
              />
              <mesh
                geometry={nodes['car-passenger-wheel_FR_2'].geometry}
                material={nodes['car-passenger-wheel_FR_2'].material}
              />
            </group>
          </group>
        </group>
      );
    };
  }, [nodes]);

  return <context.Provider value={{ Car }}>{children}</context.Provider>;
}
