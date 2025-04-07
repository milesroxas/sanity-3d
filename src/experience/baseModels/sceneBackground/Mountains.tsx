/*

gltf-pipeline -i raw-exports/models/mountain.gltf -o public/models/mountain.glb

*/

import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

export function Mountains(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/mountain.glb') as unknown as MeshGLTFModel;
  const LowpolyMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        name="terrain-mountains"
        geometry={nodes['terrain-mountains'].geometry}
        material={materials['LOWPOLY-COLORS']}
        scale={5.026}
      />
    </group>
  );
}

useGLTF.preload('/models/mountain.glb');
