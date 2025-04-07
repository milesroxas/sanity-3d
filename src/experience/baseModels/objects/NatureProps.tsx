import { MeshGLTFModel } from '@/experience/types/modelTypes';
import { createSharedAtlasMaterial } from '@/experience/utils/materialUtils';
import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

export function NatureProps(props: ThreeElements['group']) {
  const { nodes, materials } = useGLTF('/models/nature-props.glb') as unknown as MeshGLTFModel;
  const LowpolyMaterial = createSharedAtlasMaterial(materials);

  return (
    <group {...props} dispose={null}>
      <mesh
        name="stone-medium-flat"
        castShadow
        receiveShadow
        geometry={nodes['stone-medium-flat'].geometry}
        material={LowpolyMaterial}
        position={[-11.728, 0, 0]}
      />
      <mesh
        name="stone-flat"
        castShadow
        receiveShadow
        geometry={nodes['stone-flat'].geometry}
        material={LowpolyMaterial}
        position={[-28.734, 0, 0]}
      />
      <mesh
        name="shrub-flowers"
        castShadow
        receiveShadow
        geometry={nodes['shrub-flowers'].geometry}
        material={LowpolyMaterial}
        position={[-33.362, 0, 0]}
      />
      <mesh
        name="scifi-pot-low-palm"
        castShadow
        receiveShadow
        geometry={nodes['scifi-pot-low-palm'].geometry}
        material={LowpolyMaterial}
        position={[43.723, 0, 0]}
      />
      <mesh
        name="scifi-pot-big-plant"
        castShadow
        receiveShadow
        geometry={nodes['scifi-pot-big-plant'].geometry}
        material={LowpolyMaterial}
        position={[8.486, 0, 0]}
      />
      <mesh
        name="rock-sharp"
        castShadow
        receiveShadow
        geometry={nodes['rock-sharp'].geometry}
        material={LowpolyMaterial}
        position={[26.118, 0, 0]}
      />
      <mesh
        name="rock-large"
        castShadow
        receiveShadow
        geometry={nodes['rock-large'].geometry}
        material={LowpolyMaterial}
        position={[32.929, 0, 0]}
      />
      <mesh
        name="plant-bush-small"
        castShadow
        receiveShadow
        geometry={nodes['plant-bush-small'].geometry}
        material={LowpolyMaterial}
        position={[-45.326, 0, 0]}
      />
      <mesh
        name="palm-small"
        castShadow
        receiveShadow
        geometry={nodes['palm-small'].geometry}
        material={LowpolyMaterial}
        position={[14.512, 0, 0]}
      />
      <mesh
        name="palm-high"
        castShadow
        receiveShadow
        geometry={nodes['palm-high'].geometry}
        material={LowpolyMaterial}
        position={[59.695, 0, 0]}
      />
      <mesh
        name="palm-bush-big"
        castShadow
        receiveShadow
        geometry={nodes['palm-bush-big'].geometry}
        material={LowpolyMaterial}
        position={[-1.67, 0, 0]}
      />
      <mesh
        name="palm-big"
        castShadow
        receiveShadow
        geometry={nodes['palm-big'].geometry}
        material={LowpolyMaterial}
        position={[50.924, 0, 0]}
        scale={1.4}
      />
      <mesh
        name="grass-tall"
        castShadow
        receiveShadow
        geometry={nodes['grass-tall'].geometry}
        material={LowpolyMaterial}
        position={[-24.161, 0, 0]}
      />
      <mesh
        name="grass"
        castShadow
        receiveShadow
        geometry={nodes.grass.geometry}
        material={LowpolyMaterial}
        position={[-37.514, 0, 0]}
      />
      <mesh
        name="flower-poisonous"
        castShadow
        receiveShadow
        geometry={nodes['flower-poisonous'].geometry}
        material={LowpolyMaterial}
        position={[-41.423, 0, 0]}
      />
      <mesh
        name="cactus-medium"
        castShadow
        receiveShadow
        geometry={nodes['cactus-medium'].geometry}
        material={LowpolyMaterial}
        position={[-19.993, 0, 0]}
      />
      <mesh
        name="cactus-big"
        castShadow
        receiveShadow
        geometry={nodes['cactus-big'].geometry}
        material={LowpolyMaterial}
        position={[38.884, 0, 0]}
      />
      <mesh
        name="cactus-basic"
        castShadow
        receiveShadow
        geometry={nodes['cactus-basic'].geometry}
        material={LowpolyMaterial}
        position={[-16.204, 0, 0]}
      />
      <mesh
        name="bush-medium-high"
        castShadow
        receiveShadow
        geometry={nodes['bush-medium-high'].geometry}
        material={LowpolyMaterial}
        position={[3.412, 0, 0]}
      />
      <mesh
        name="bush-medium"
        castShadow
        receiveShadow
        geometry={nodes['bush-medium'].geometry}
        material={LowpolyMaterial}
        position={[-6.78, 0, 0]}
      />
      <mesh
        name="bush-big"
        castShadow
        receiveShadow
        geometry={nodes['bush-big'].geometry}
        material={LowpolyMaterial}
        position={[20.135, 0, 0]}
      />
      <mesh
        name="palm"
        castShadow
        receiveShadow
        geometry={nodes.palm.geometry}
        material={LowpolyMaterial}
        position={[66.605, 0, 0]}
        scale={1.2}
      />
    </group>
  );
}
useGLTF.preload('/models/nature-props.glb');
