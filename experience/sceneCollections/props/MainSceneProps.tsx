import React from "react";
import { Windmill } from "./models/Windmill";

function MainSceneProps() {
  return (
    <>
      {/* Front row */}
      <Windmill position={[-66.083, 2.667, 100.273]} speed={1} />
      <Windmill position={[-53.617, 2.667, 100.273]} speed={0.8} />

      {/* Back row */}
      <Windmill position={[-57.942, 2.667, 109.056]} speed={1.2} />
      <Windmill position={[-70.284, 2.667, 109.056]} speed={0.9} />
    </>
  );
}

export default MainSceneProps;
