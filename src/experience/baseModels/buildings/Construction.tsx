import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

export function Construction(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/construction.glb') as unknown as MeshGLTFModel;
  const LowpolyMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        name="planks-stack"
        castShadow
        receiveShadow
        geometry={nodes['planks-stack'].geometry}
        material={LowpolyMaterial}
      />
      <mesh
        name="pipe-concrete-stack"
        castShadow
        receiveShadow
        geometry={nodes['pipe-concrete-stack'].geometry}
        material={LowpolyMaterial}
        position={[10.891, 0, 0]}
        scale={[1, 0.986, 1]}
      />
      <mesh
        name="crane-tower"
        castShadow
        receiveShadow
        geometry={nodes['crane-tower'].geometry}
        material={LowpolyMaterial}
        position={[-13.509, 0, 0]}
      />
      <mesh
        name="contruction-small"
        castShadow
        receiveShadow
        geometry={nodes['contruction-small'].geometry}
        material={LowpolyMaterial}
        position={[40.269, 0, 0]}
      />
      <mesh
        name="contruction-large"
        castShadow
        receiveShadow
        geometry={nodes['contruction-large'].geometry}
        material={LowpolyMaterial}
        position={[26.408, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload('/models/construction.glb');
