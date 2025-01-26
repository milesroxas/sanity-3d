"use client";
// import { useRouter } from "next/navigation";
import WorldFloor from "../../sceneCollections/WorldFloor";
import { Environment } from "@react-three/drei";
import GatedCommunity from "../../sceneCollections/gatedCommunity/GatedCommunity";
import { Mountains } from "../../sceneCollections/mountains/Mountains";
import Lights from "../../sceneCollections/lights/Lights";
import Trees from "../../sceneCollections/trees/Trees";
import { ConstructionBuildings } from "../../sceneCollections/construction/models/ConstructionBuildings";
import { CompanyBuildings } from "../../sceneCollections/company/models/CompanyBuildings";
import { ShopsBuildings } from "../../sceneCollections/shops/ShopsMainScene";
import { ResortBuildings } from "../../sceneCollections/resort/models/ResortBuildings";
import { HomesRightBuildings } from "../../sceneCollections/homesRight/models/HomesRightBuildings";
import { EventsBuildings } from "../../sceneCollections/events/models/EventsBuildings";
import { FarmBuildings } from "../../sceneCollections/farm/models/FarmBuildings";
import { ExperienceController } from "../../sceneControllers/ExperienceController";
import MainSceneMarkers from "../../sceneControllers/poiMarkers/MainSceneMarkers";

export default function MainScene({ scene }: { scene: Sanity.Scene }) {
  console.log("main scene", scene);
  return (
    <>
      <MainSceneMarkers scene={scene} />

      <Environment preset="sunset" />
      <ExperienceController type="Map" enabled={true} />
      <group position={[0, -0.2, 0]}>
        <WorldFloor />
      </group>
      <Trees />
      <GatedCommunity />
      <HomesRightBuildings />
      <ConstructionBuildings />
      <CompanyBuildings />
      <ShopsBuildings />
      <ResortBuildings />
      <EventsBuildings />
      <FarmBuildings />
      <Mountains />
      <Lights />
    </>
  );
}
