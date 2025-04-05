import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';

// Define GLTFResult type with our standardized approach
type GLTFResult = MeshGLTFModel & {
  nodes: {
    ['shrub-flowers']: THREE.Mesh;
    ['house-wall-wood-green-2x3m001']: THREE.Mesh;
    ['house-wall-wood-2x3m']: THREE.Mesh;
    ['flowers-window001']: THREE.Mesh;
    ['fence-vineyard']: THREE.Mesh;
    ['fence-stone-metal']: THREE.Mesh;
    ['fence-shrub']: THREE.Mesh;
    ['fence-picket']: THREE.Mesh;
    ['fence-big']: THREE.Mesh;
  };
  materials: {
    ['LOWPOLY-COLORS']: THREE.MeshStandardMaterial;
  };
};

export function Fences(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/fences.glb') as unknown as GLTFResult;

  // Create shared atlas material for better performance
  const sharedMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="shrub-flowers"
          castShadow
          receiveShadow
          geometry={nodes['shrub-flowers'].geometry}
          material={sharedMaterial}
          position={[-13.489, 0, 0]}
        />
        <mesh
          name="house-wall-wood-green-2x3m001"
          castShadow
          receiveShadow
          geometry={nodes['house-wall-wood-green-2x3m001'].geometry}
          material={sharedMaterial}
          position={[-0.348, 0, 0]}
        />
        <mesh
          name="house-wall-wood-2x3m"
          castShadow
          receiveShadow
          geometry={nodes['house-wall-wood-2x3m'].geometry}
          material={sharedMaterial}
          position={[3.258, 0, 0]}
        />
        <mesh
          name="flowers-window001"
          castShadow
          receiveShadow
          geometry={nodes['flowers-window001'].geometry}
          material={sharedMaterial}
          position={[-10.761, 0, 0]}
        />
        <mesh
          name="fence-vineyard"
          castShadow
          receiveShadow
          geometry={nodes['fence-vineyard'].geometry}
          material={sharedMaterial}
          position={[-3.466, 0, 0]}
        />
        <mesh
          name="fence-stone-metal"
          castShadow
          receiveShadow
          geometry={nodes['fence-stone-metal'].geometry}
          material={sharedMaterial}
          position={[8.853, 0, 0]}
        />
        <mesh
          name="fence-shrub"
          castShadow
          receiveShadow
          geometry={nodes['fence-shrub'].geometry}
          material={sharedMaterial}
          position={[-7.634, 0, 0]}
        />
        <mesh
          name="fence-picket"
          castShadow
          receiveShadow
          geometry={nodes['fence-picket'].geometry}
          material={sharedMaterial}
          position={[13.446, 0, 0]}
        />
        <mesh
          name="fence-big"
          castShadow
          receiveShadow
          geometry={nodes['fence-big'].geometry}
          material={sharedMaterial}
          position={[16.089, 0, 0]}
        />
      </group>
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload('/models/fences.glb');
