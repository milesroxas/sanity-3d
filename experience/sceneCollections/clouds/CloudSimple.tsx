import React, { useMemo, useContext, createContext } from "react";
import { useGLTF, Merged, Float } from "@react-three/drei";
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";
import { ThreeElements } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    ["cloud-simple"]: THREE.Mesh;
  };
  materials: {
    ["59 EMISSION-WHITE"]: THREE.MeshStandardMaterial;
  };
};

interface CloudInstances {
  CloudSimple: React.ComponentType<ThreeElements["mesh"]>;
}

type CloudPosition = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
};

const CLOUD_POSITIONS: CloudPosition[] = [
  {
    position: [6.438, 37.516, 0.274],
    scale: 1,
  },
  {
    position: [28.313, 37.516, 56.168],
    scale: 1,
  },
  {
    position: [-98.814, 37.516, 65.02],
    scale: 0.8,
  },
  {
    position: [-18.673, 37.516, -17.981],
    scale: 0.8,
  },
];

const context = createContext<CloudInstances | null>(null);

export function Instances({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const { nodes } = useGLTF("/models/clouds_group.glb") as GLTFResult;
  const instances = useMemo(
    () => ({
      CloudSimple: nodes["cloud-simple"],
    }),
    [nodes]
  );

  return (
    <Merged meshes={instances} {...props}>
      {(instances: CloudInstances) => (
        <context.Provider value={instances}>{children}</context.Provider>
      )}
    </Merged>
  );
}

function Cloud({ position, rotation = [0, 0, 0], scale = 1 }: CloudPosition) {
  const instances = useContext(context);

  if (!instances) {
    console.error("Cloud must be used within an Instances component");
    return null;
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <instances.CloudSimple name="cloud-simple" />
    </group>
  );
}

function CloudsContent(props: ThreeElements["group"]) {
  return (
    <group {...props} dispose={null}>
      {CLOUD_POSITIONS.map((cloudProps, index) => (
        <Cloud key={index} {...cloudProps} />
      ))}
    </group>
  );
}

export function CloudSimple(props: ThreeElements["group"]) {
  return (
    <Instances>
      <Float rotationIntensity={0.05} floatIntensity={0.08} speed={1}>
        <CloudsContent {...props} />
      </Float>
    </Instances>
  );
}

useGLTF.preload("/models/clouds_group.glb");
