import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

export function StreetProps(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/street-props.glb') as unknown as MeshGLTFModel;
  const LowpolyMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['traffic-sign-no-entry'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[-2.417, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['traffic-lights'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[5.612, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['lamp-road-double'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[11.684, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['lamp-road'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[21.585, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['lamp-city'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[27.476, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['traffic-cone'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[0, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['wall-concrete'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[-7.737, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['fire-hydrant'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[-16.265, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['bus-stop-sign'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[-20.273, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['bench-old'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[-25.173, 0, -0.455]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['bus-stop'].geometry}
        material={materials['LOWPOLY-COLORS']}
        position={[-31.238, 0, 0]}
      />
    </group>
  );
}
useGLTF.preload('/models/street-props.glb');
