import { Instances } from "../baseModels/nature/NatureGroup";
import { useNatureInstances } from "../baseModels/nature/useNatureInstances";

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
      <instances.CactusBasic
        position={[46.640633, 2.767133, 96.634781]}
        castShadow
        receiveShadow
      />
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
    </>
  );
}
