import React from "react";
import { 
  HouseMedium1, 
  HouseSmall1, 
  HouseSmall2, 
  useHouseGLTF 
} from "../../baseModels/buildings/HouseBase";

/**
 * HomesOuterLeft component that renders a collection of houses
 * positioned in the outer left area of the scene
 */
export function HomesOuterLeft() {
  // Load the house GLTF model once and share it among all house instances
  const { nodes, materials } = useHouseGLTF();

  return (
    <group name="homes-outer-left">
      {/* Position houses with appropriate transformations */}
      {/* <group position={[-10, 0, 5]} rotation={[0, Math.PI / 6, 0]}>
        <HouseSmall1 nodes={nodes} materials={materials} />
      </group>

       */}

      <group position={[-112.149170, 2.714466, -22.537394]} rotation={[0.000000, 0.000000, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>

      <group position={[-126.116600, 2.714466, -22.537394]} rotation={[0.000000, 0.000000, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>

      <group position={[-140.271973, 2.714466, -22.537394]} rotation={[0.000000, 0.000000, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>

      <group position={[-154.464355, 2.714466, -22.537394]} rotation={[0.000000, 0.000000, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>

      <group position={[-113.452477, 2.714466, -7.535646]} rotation={[0.000000, 3.141593, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>

      <group position={[-131.950989, 2.714466, -7.535646]} rotation={[0.000000, 3.141593, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>

      <group position={[-146.262787, 2.714466, -7.535646]} rotation={[0.000000, 3.141593, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>

      <group position={[-161.332520, 2.714466, -7.535646]} rotation={[0.000000, 3.141593, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>
      
      
      


      <group position={[-128.001480, 2.807943, 1.095072]} rotation={[0.000000, 0.000000, 0.000000]}>
        <HouseMedium1 nodes={nodes} materials={materials} />
      </group>

      <group position={[-131.950989, 2.714466, 1.143158]} rotation={[0.000000, 0.000000, 0.000000]}>
        <HouseSmall2 nodes={nodes} materials={materials} />
      </group>

      <group position={[-160.780197, 2.807943, 0.559080]} rotation={[0.000000, 0.000000, 0.000000]}>
        <HouseMedium1 nodes={nodes} materials={materials} />
      </group>
      
      <group position={[-174.401215, 2.807943, 0.559080]} rotation={[0.000000, 0.000000, 0.000000]}>
        <HouseMedium1 nodes={nodes} materials={materials} />
      </group>

    </group>
  );
}

export default HomesOuterLeft;
