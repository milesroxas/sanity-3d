import { useGLTF } from "@react-three/drei";
import { Merged } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { createContext, useContext, useMemo } from "react";
import { ThreeElements } from "@react-three/fiber";
import { CarInstances } from "./types";

type GLTFResult = GLTF & {
  nodes: {
    ["car-passenger-base001"]: THREE.Mesh;
    ["car-passenger-base001_1"]: THREE.Mesh;
    ["car-passenger-base001_2"]: THREE.Mesh;
    ["car-passenger-base001_3"]: THREE.Mesh;
    ["car-passenger-base001_4"]: THREE.Mesh;
    ["car-passenger-base001_5"]: THREE.Mesh;
    ["car-passenger-wheel_BL001"]: THREE.Mesh;
    ["car-passenger-wheel_BL001_1"]: THREE.Mesh;
    ["car-passenger-wheel_BR001"]: THREE.Mesh;
    ["car-passenger-wheel_BR001_1"]: THREE.Mesh;
    ["car-passenger-wheel_FL001"]: THREE.Mesh;
    ["car-passenger-wheel_FL001_1"]: THREE.Mesh;
    ["car-passenger-wheel_FR_1"]: THREE.Mesh;
    ["car-passenger-wheel_FR_2"]: THREE.Mesh;
  };
  materials: {
    ["23 GREY-WHITE.001"]: THREE.MeshPhysicalMaterial;
    ["64 GLASS.002"]: THREE.MeshPhysicalMaterial;
    ["17 GREY-DARKEST.002"]: THREE.MeshPhysicalMaterial;
    Head_Lights: THREE.MeshPhysicalMaterial;
    ["57 BLACK.001"]: THREE.MeshPhysicalMaterial;
    Tail_Light: THREE.MeshPhysicalMaterial;
    ["20 GREY.002"]: THREE.MeshPhysicalMaterial;
  };
};

const context = createContext<CarInstances | null>(null);

const CAR_POSITIONS: Array<{
  position: [number, number, number];
  rotation: [number, number, number];
}> = [
  { position: [64.85141, 2.687342, 23.099749], rotation: [0.0, 1.570796, 0.0] },
  {
    position: [55.614433, 2.687342, 20.36821],
    rotation: [0.0, 1.570796, 0.0],
  },
  {
    position: [55.614433, 2.687342, 14.881134],
    rotation: [0.0, 1.570796, 0.0],
  },
  {
    position: [55.614433, 2.687342, 11.823608],
    rotation: [0.0, 1.570796, 0.0],
  },
  {
    position: [55.614433, 2.687342, 6.425247],
    rotation: [0.0, 1.570796, 0.0],
  },
  {
    position: [64.85141, 2.687342, 17.612673],
    rotation: [0.0, 1.570796, 0.0],
  },
  {
    position: [64.85141, 2.687342, 14.555147],
    rotation: [0.0, 4.712389, 0.0],
  },
  {
    position: [64.85141, 2.687342, 9.156786],
    rotation: [0.0, 1.570796, 0.0],
  },
];

function Car({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const instances = useContext(context);
  if (!instances) return null;

  return <instances.Car position={position} rotation={rotation} />;
}

export function Instances({ children }: { children: React.ReactNode }) {
  const { nodes } = useGLTF("/models/vehicles_car_1.glb") as GLTFResult;

  const Car = useMemo(() => {
    return function Car(props?: ThreeElements["group"]) {
      return (
        <group {...props}>
          <group name="car-passenger">
            <group name="car-passenger-base">
              <mesh
                geometry={nodes["car-passenger-base001"].geometry}
                material={nodes["car-passenger-base001"].material}
              />
              <mesh
                geometry={nodes["car-passenger-base001_1"].geometry}
                material={nodes["car-passenger-base001_1"].material}
              />
              <mesh
                geometry={nodes["car-passenger-base001_2"].geometry}
                material={nodes["car-passenger-base001_2"].material}
              />
              <mesh
                geometry={nodes["car-passenger-base001_3"].geometry}
                material={nodes["car-passenger-base001_3"].material}
              />
              <mesh
                geometry={nodes["car-passenger-base001_4"].geometry}
                material={nodes["car-passenger-base001_4"].material}
              />
              <mesh
                geometry={nodes["car-passenger-base001_5"].geometry}
                material={nodes["car-passenger-base001_5"].material}
              />
            </group>
            <group name="car-passenger-wheels">
              <mesh
                geometry={nodes["car-passenger-wheel_BL001"].geometry}
                material={nodes["car-passenger-wheel_BL001"].material}
              />
              <mesh
                geometry={nodes["car-passenger-wheel_BL001_1"].geometry}
                material={nodes["car-passenger-wheel_BL001_1"].material}
              />
              <mesh
                geometry={nodes["car-passenger-wheel_BR001"].geometry}
                material={nodes["car-passenger-wheel_BR001"].material}
              />
              <mesh
                geometry={nodes["car-passenger-wheel_BR001_1"].geometry}
                material={nodes["car-passenger-wheel_BR001_1"].material}
              />
              <mesh
                geometry={nodes["car-passenger-wheel_FL001"].geometry}
                material={nodes["car-passenger-wheel_FL001"].material}
              />
              <mesh
                geometry={nodes["car-passenger-wheel_FL001_1"].geometry}
                material={nodes["car-passenger-wheel_FL001_1"].material}
              />
              <mesh
                geometry={nodes["car-passenger-wheel_FR_1"].geometry}
                material={nodes["car-passenger-wheel_FR_1"].material}
              />
              <mesh
                geometry={nodes["car-passenger-wheel_FR_2"].geometry}
                material={nodes["car-passenger-wheel_FR_2"].material}
              />
            </group>
          </group>
        </group>
      );
    };
  }, [nodes]);

  return <context.Provider value={{ Car }}>{children}</context.Provider>;
}

function ParkedCars() {
  return (
    <Instances>
      {CAR_POSITIONS.map((props, i) => (
        <Car key={i} {...props} />
      ))}
    </Instances>
  );
}

export default ParkedCars;
