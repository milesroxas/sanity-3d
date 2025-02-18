import React from "react";
import { DoubleStreetLights } from "./models/DoubleStreetLights";
import { SingleStreetLights } from "./models/SingleStreetLights";
function Lights() {
  return (
    <>
      <DoubleStreetLights />
      <SingleStreetLights />
    </>
  );
}

export default Lights;
