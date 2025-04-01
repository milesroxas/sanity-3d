import { Instances } from '../baseModels/nature/NatureGroup';
import { useNatureInstances } from '../baseModels/nature/useNatureInstances';

export default function NatureScene() {
  return (
    <Instances>
      <NatureContent />
    </Instances>
  );
}

function NatureContent() {
  const instances = useNatureInstances();

  return (
    <>
      <instances.RockLarge
        position={[44.553886, 2.686794, 93.908958]}
        rotation={[-Math.PI, 0.768, -Math.PI]}
        scale={0.803}
        castShadow
        receiveShadow
      />
      <instances.CactusBasic position={[46.640633, 2.767133, 96.634781]} castShadow receiveShadow />
      <instances.RockLarge
        position={[-52.236622, 2.636945, 124.352394]}
        rotation={[0.0, 2.37331, -0.0]}
        castShadow
        receiveShadow
      />
      <instances.CactusBigGreen
        position={[-54.488575, 2.767133, 124.516472]}
        rotation={[0.0, 0.0, 0.0]}
        castShadow
        receiveShadow
      />

      <instances.RockLarge
        position={[-63.884426, 2.636945, 106.518158]}
        rotation={[0.0, 4.131083, -0.0]}
        scale={0.803}
        castShadow
        receiveShadow
      />

      <instances.RockLarge
        position={[-73.363739, 2.636945, 111.951576]}
        rotation={[0.0, 2.925174, -0.0]}
        scale={0.497}
        castShadow
        receiveShadow
      />

      <instances.RockLarge
        position={[-87.374016, 2.636945, 95.989288]}
        rotation={[0.0, 2.736665, -0.0]}
        scale={0.568}
        castShadow
        receiveShadow
      />

      <instances.RockLarge
        position={[-49.610352, 3.204971, 61.69175]}
        rotation={[0.0, 1.737267, -0.0]}
        scale={0.6}
        castShadow
        receiveShadow
      />

      <instances.RockLarge
        position={[-46.678917, 3.204971, -6.8646]}
        rotation={[0.0, 3.202998, -0.0]}
        scale={0.5}
        castShadow
        receiveShadow
      />
    </>
  );
}
