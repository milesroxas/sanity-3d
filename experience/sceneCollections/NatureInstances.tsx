import { Instances } from '../baseModels/nature/NatureGroup';
import { useNatureInstances } from '../baseModels/nature/useNatureInstances';
import natureInstancesData from '../baseModels/nature/natureInstances.json';
import { Vector3Tuple } from 'three';
import { NatureInstanceData } from '../baseModels/nature/types';

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
      {(natureInstancesData as NatureInstanceData[]).map((item, index) => {
        const InstanceComponent = instances[item.type];
        return (
          <InstanceComponent
            key={`${item.type}-${index}`}
            position={item.position as Vector3Tuple}
            rotation={item.rotation as Vector3Tuple}
            scale={item.scale}
            castShadow
            receiveShadow
          />
        );
      })}
    </>
  );
}
