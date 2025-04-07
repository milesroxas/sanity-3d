import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import type * as THREE from 'three';
export function Vehicles(props: ThreeElements['group']) {
  type GLTFResult = MeshGLTFModel & {
    materials: {
      LogoWrap: THREE.MeshStandardMaterial;
    };
  };
  const { nodes, materials } = useGLTF('/models/vehicles.glb') as unknown as GLTFResult;
  const LowpolyMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['city-bus'].geometry}
        material={materials['LowpolyMaterial']}
        position={[28.233, 0.003, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['camping-van'].geometry}
        material={materials['LowpolyMaterial']}
        position={[13.17, 0.041, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.truck.geometry}
        material={materials['LowpolyMaterial']}
        position={[7.093, 0.015, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.taxi.geometry}
        material={materials['LowpolyMaterial']}
        position={[-3.997, 0.034, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['hippie-van'].geometry}
        material={materials['LowpolyMaterial']}
        position={[-11.194, -0.008, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['cement-truck'].geometry}
        material={materials['LowpolyMaterial']}
        position={[20.458, 0.013, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.jeep.geometry}
        material={materials['LowpolyMaterial']}
        position={[-7.309, 0.004, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['car-sedan'].geometry}
        material={materials['LowpolyMaterial']}
        position={[-15.585, 0.034, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.camper.geometry}
        material={materials['LowpolyMaterial']}
        position={[0.061, 0.034, 0]}
      />
      <group position={[-20.532, 0, 0]} scale={1.317}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['patrol-car_1'].geometry}
          material={materials['LowpolyMaterial']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['patrol-car_2'].geometry}
          material={materials.LogoWrap}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['plane-passenger-base'].geometry}
        material={materials['LowpolyMaterial']}
        position={[62.69, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload('/models/vehicles.glb');
