import { useRouter } from "next/navigation";
import WorldFloor from "./sceneCollections/WorldFloor";
import { Environment, MapControls } from "@react-three/drei";
import GatedCommunity from "./sceneCollections/gatedCommunity/GatedCommunity";
import { Mountains } from "./sceneCollections/mountains/Mountains";
import Lights from "./sceneCollections/lights/Lights";
export default function Scene() {
  const router = useRouter();

  return (
    <>
      <Environment preset="sunset" />
      <MapControls />
      <group position={[0, -0.2, 0]}>
        <WorldFloor />
      </group>
      <GatedCommunity />
      <Mountains />
      <Lights />
    </>
  );
}
