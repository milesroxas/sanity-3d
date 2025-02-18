import HouseInstances, { RawInstanceData } from "./models/HouseInstances";
import mainSceneData from "@/experience/scenes/mainScene/lib/world_gated_houses_data.json";

function ZonesGatedCommunity() {
  return (
    <>
      <HouseInstances
        instanceData={mainSceneData as unknown as RawInstanceData}
      />
    </>
  );
}

export default ZonesGatedCommunity;
