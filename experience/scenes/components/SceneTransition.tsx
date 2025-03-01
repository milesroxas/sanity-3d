import { OrthographicCamera } from "@react-three/drei";
import { Hud } from "@react-three/drei";
import React from "react";

function SceneTransition({
  transition,
  color,
}: {
  transition: boolean;
  color: string;
}) {
  // If transition is false, don't render anything
  if (!transition) return null;

  return (
    <>
      <Hud>
        <OrthographicCamera
          makeDefault
          top={1}
          right={1}
          bottom={-1}
          left={-1}
          near={0}
          far={1}
        />
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </Hud>
    </>
  );
}

export default SceneTransition;
