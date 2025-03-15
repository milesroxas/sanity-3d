import * as THREE from "three";
import {
  useCommercialBuildingsGLTF,
  ShopsBuilding,
  ApartmentsBuilding,
  RestaurantBuilding,
  PostBuilding,
  MuseumBuilding,
  BuildingInstanceData
} from "@/experience/baseModels/buildings/CommercialBldgs";

interface CommercialBuildingInstancesProps {
  buildingInstances: BuildingInstanceData[];
}

function CommercialBuildingInstances({
  buildingInstances
}: CommercialBuildingInstancesProps) {
  const { nodes, materials } = useCommercialBuildingsGLTF();

  // Render each building based on its type
  const renderBuilding = (instance: BuildingInstanceData, index: number) => {
    const { type, position, rotation, scale = 1 } = instance;
    const key = `${type}-${index}`;

    switch (type) {
      case 'shops':
        return (
          <group
            key={key}
            position={new THREE.Vector3(...position)}
            rotation={new THREE.Euler(...rotation)}
            scale={scale}
          >
            <ShopsBuilding nodes={nodes} materials={materials} />
          </group>
        );
      case 'apartments':
        return (
          <group
            key={key}
            position={new THREE.Vector3(...position)}
            rotation={new THREE.Euler(...rotation)}
            scale={scale}
          >
            <ApartmentsBuilding nodes={nodes} materials={materials} />
          </group>
        );
      case 'restaurant':
        return (
          <group
            key={key}
            position={new THREE.Vector3(...position)}
            rotation={new THREE.Euler(...rotation)}
            scale={scale}
          >
            <RestaurantBuilding nodes={nodes} materials={materials} />
          </group>
        );
      case 'post':
        return (
          <group
            key={key}
            position={new THREE.Vector3(...position)}
            rotation={new THREE.Euler(...rotation)}
            scale={scale}
          >
            <PostBuilding nodes={nodes} materials={materials} />
          </group>
        );
      case 'museum':
        return (
          <group
            key={key}
            position={new THREE.Vector3(...position)}
            rotation={new THREE.Euler(...rotation)}
            scale={scale}
          >
            <MuseumBuilding nodes={nodes} materials={materials} />
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group>
      {buildingInstances.map((instance, index) => renderBuilding(instance, index))}
    </group>
  );
}

export default CommercialBuildingInstances; 