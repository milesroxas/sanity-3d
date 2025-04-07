/*

gltf-pipeline -i raw-exports/models/houses.gltf -o public/models/houses.glb --keep-image

*/

import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

export function Houses(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/houses.glb') as unknown as MeshGLTFModel;
  const LowpolyMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        name="industry-building"
        castShadow
        receiveShadow
        geometry={nodes['industry-building'].geometry}
        material={LowpolyMaterial}
        position={[53.025, 0, 0]}
      />
      <mesh
        name="building-house-modern"
        castShadow
        receiveShadow
        geometry={nodes['building-house-modern'].geometry}
        material={LowpolyMaterial}
        position={[30.839, 0, 0]}
      />
      <mesh
        name="BLDG_House_Small_01"
        castShadow
        receiveShadow
        geometry={nodes.BLDG_House_Small_01.geometry}
        material={LowpolyMaterial}
        position={[-8.947, 1.49, -1.083]}
      />
      <mesh
        name="BLDG_House_Small_02"
        castShadow
        receiveShadow
        geometry={nodes.BLDG_House_Small_02.geometry}
        material={LowpolyMaterial}
        position={[4.924, 1.705, -1.08]}
      />
      <mesh
        name="BLDG_House_Medium_01"
        castShadow
        receiveShadow
        geometry={nodes.BLDG_House_Medium_01.geometry}
        material={LowpolyMaterial}
        position={[12.472, 3.978, 0.412]}
      />
    </group>
  );
}

useGLTF.preload('/models/houses.glb');
