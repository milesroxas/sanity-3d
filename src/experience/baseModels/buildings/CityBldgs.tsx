/*

gltf-pipeline -i raw-exports/models/houses.gltf -o public/models/houses.glb --keep-image

*/

import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

export function CityBldgs(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/city-buildings.glb') as unknown as MeshGLTFModel;
  const LowpolyMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        name="industry-factory-old"
        castShadow
        receiveShadow
        geometry={nodes['industry-factory-old'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -313.941]}
      />
      <mesh
        name="industry-factory-hall"
        castShadow
        receiveShadow
        geometry={nodes['industry-factory-hall'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -272.846]}
      />
      <mesh
        name="building-train-station"
        castShadow
        receiveShadow
        geometry={nodes['building-train-station'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -194.129]}
      />
      <mesh
        name="building-office-rounded"
        castShadow
        receiveShadow
        geometry={nodes['building-office-rounded'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, 51.357]}
      />
      <mesh
        name="building-office-pyramid"
        castShadow
        receiveShadow
        geometry={nodes['building-office-pyramid'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, 86.87]}
      />
      <mesh
        name="building-mall"
        castShadow
        receiveShadow
        geometry={nodes['building-mall'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, 18.57]}
      />
      <mesh
        name="building-hotel"
        castShadow
        receiveShadow
        geometry={nodes['building-hotel'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -86.794]}
      />
      <mesh
        name="building-hospital"
        castShadow
        receiveShadow
        geometry={nodes['building-hospital'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -53.107]}
      />
      <mesh
        name="building-cinema"
        castShadow
        receiveShadow
        geometry={nodes['building-cinema'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, 123.132]}
      />
      <mesh
        name="building-casino"
        castShadow
        receiveShadow
        geometry={nodes['building-casino'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -237.217]}
      />
      <mesh
        name="building-carwash"
        castShadow
        receiveShadow
        geometry={nodes['building-carwash'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -16.717]}
      />
      <mesh
        name="building-block-5floor-front"
        castShadow
        receiveShadow
        geometry={nodes['building-block-5floor-front'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -119.942]}
      />
      <mesh
        name="building-block-5floor-corner"
        castShadow
        receiveShadow
        geometry={nodes['building-block-5floor-corner'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -152.492]}
      />
    </group>
  );
}

useGLTF.preload('/models/city-buildings.glb');
