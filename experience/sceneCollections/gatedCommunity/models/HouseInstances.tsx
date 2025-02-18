import * as THREE from "three";
import {
  useHouseGLTF,
  HouseMedium1,
  HouseSmall1,
  HouseSmall2,
} from "@/experience/baseModels/buildings/HouseBase";

// Define TypeScript interfaces for the JSON data
interface HouseInstance {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number] | null;
}

export interface RawInstanceData {
  medium_houses: HouseInstance[];
  small_houses_1: HouseInstance[];
  small_houses_2: HouseInstance[];
}

interface RawHouseData {
  name: unknown;
  position: unknown;
  rotation: unknown;
}

interface HouseInstancesProps {
  instanceData: RawInstanceData;
}

// Validation function remains the same
const validateHouseInstance = (house: RawHouseData): HouseInstance => {
  if (
    !house.name ||
    !Array.isArray(house.position) ||
    house.position.length !== 3 ||
    (house.rotation !== null &&
      (!Array.isArray(house.rotation) || house.rotation.length !== 3))
  ) {
    throw new Error("Invalid house instance data");
  }

  return {
    name: house.name as string,
    position: house.position as [number, number, number],
    rotation: house.rotation as [number, number, number] | null,
  };
};

function HouseInstances({
  instanceData: rawInstanceData,
}: HouseInstancesProps) {
  const { nodes, materials } = useHouseGLTF();

  // Process the instance data
  const processedInstanceData = {
    medium_houses: rawInstanceData.medium_houses.map(validateHouseInstance),
    small_houses_1: rawInstanceData.small_houses_1.map(validateHouseInstance),
    small_houses_2: rawInstanceData.small_houses_2.map(validateHouseInstance),
  };

  const renderHouseGroup = (
    houseData: HouseInstance[],
    HouseComponent: React.FC<{
      nodes: typeof nodes;
      materials: typeof materials;
    }>
  ) => {
    return houseData.map((instance) => {
      const { position, rotation, name } = instance;
      return (
        <group
          key={name}
          position={new THREE.Vector3(...position)}
          rotation={rotation ? new THREE.Euler(...rotation) : undefined}
          scale={new THREE.Vector3(1, 1, 1)}
        >
          <HouseComponent nodes={nodes} materials={materials} />
        </group>
      );
    });
  };

  return (
    <group>
      {renderHouseGroup(processedInstanceData.medium_houses, HouseMedium1)}
      {renderHouseGroup(processedInstanceData.small_houses_1, HouseSmall1)}
      {renderHouseGroup(processedInstanceData.small_houses_2, HouseSmall2)}
    </group>
  );
}

export default HouseInstances;
