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
        name="traffic-sign-no-entry"
        castShadow
        receiveShadow
        geometry={nodes['traffic-sign-no-entry'].geometry}
        material={LowpolyMaterial}
        position={[-2.417, 0, -0.455]}
      />
      <mesh
        name="traffic-lights"
        castShadow
        receiveShadow
        geometry={nodes['traffic-lights'].geometry}
        material={LowpolyMaterial}
        position={[5.612, 0, -0.455]}
      />
      <mesh
        name="lamp-road-double"
        castShadow
        receiveShadow
        geometry={nodes['lamp-road-double'].geometry}
        material={LowpolyMaterial}
        position={[11.684, 0, -0.455]}
      />
      <mesh
        name="lamp-road"
        castShadow
        receiveShadow
        geometry={nodes['lamp-road'].geometry}
        material={LowpolyMaterial}
        position={[21.585, 0, -0.455]}
      />
      <mesh
        name="lamp-city"
        castShadow
        receiveShadow
        geometry={nodes['lamp-city'].geometry}
        material={LowpolyMaterial}
        position={[27.476, 0, -0.455]}
      />
      <mesh
        name="traffic-cone"
        castShadow
        receiveShadow
        geometry={nodes['traffic-cone'].geometry}
        material={LowpolyMaterial}
        position={[0, 0, -0.455]}
      />
      <mesh
        name="wall-concrete"
        castShadow
        receiveShadow
        geometry={nodes['wall-concrete'].geometry}
        material={LowpolyMaterial}
        position={[-7.737, 0, -0.455]}
      />
      <mesh
        name="fire-hydrant"
        castShadow
        receiveShadow
        geometry={nodes['fire-hydrant'].geometry}
        material={LowpolyMaterial}
        position={[-16.265, 0, -0.455]}
      />
      <mesh
        name="bus-stop-sign"
        castShadow
        receiveShadow
        geometry={nodes['bus-stop-sign'].geometry}
        material={LowpolyMaterial}
        position={[-20.273, 0, -0.455]}
      />
      <mesh
        name="bench-old"
        castShadow
        receiveShadow
        geometry={nodes['bench-old'].geometry}
        material={LowpolyMaterial}
        position={[-25.173, 0, -0.455]}
      />
      <mesh
        name="bus-stop"
        castShadow
        receiveShadow
        geometry={nodes['bus-stop'].geometry}
        material={LowpolyMaterial}
        position={[-31.238, 0, 0]}
      />
      <mesh
        name="flag-golf_red"
        castShadow
        receiveShadow
        geometry={nodes['flag-golf_red'].geometry}
        material={LowpolyMaterial}
        position={[-36.024, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['water-tower-big'].geometry}
        material={LowpolyMaterial}
        position={[34.254, 0, 0]}
      />
      <group name="windmill">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['windmill-base'].geometry}
          material={LowpolyMaterial}
          position={[49.817, 0, 1.344]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['windmill-propeller'].geometry}
          material={LowpolyMaterial}
          position={[49.833, 14.84, 0.437]}
        />
      </group>
    </group>
  );
}
useGLTF.preload('/models/street-props.glb');
