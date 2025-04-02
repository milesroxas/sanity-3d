import React from 'react';
import { Windmill } from './models/Windmill';
import { Billboard } from './models/Billboard';

function MainSceneProps() {
  return (
    <>
      {/* Front row */}

      {/* Back row */}

      <Windmill
        position={[165.0, 2.666662, -103.43235]}
        rotation={[0.0, -0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[165.0, 2.666662, -120.000099]}
        rotation={[0.0, -0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[165.0, 2.666662, -88.968391]}
        rotation={[0.0, -0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[180.931183, 2.666662, -120.000099]}
        rotation={[0.0, -0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[180.931183, 2.666662, -103.43235]}
        rotation={[0.0, -0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[180.931183, 2.666662, -88.968391]}
        rotation={[0.0, -0.785398, 0.0]}
        speed={0.9}
      />

      <Windmill
        position={[-182.844711, 2.666658, -5.180639]}
        rotation={[0.0, 0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[-192.494614, 2.666658, -5.180639]}
        rotation={[0.0, 0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[-201.742599, 2.666658, -5.180639]}
        rotation={[0.0, 0.785398, -0.0]}
        speed={0.9}
      />
      <Windmill
        position={[-182.844711, 2.666658, -21.779037]}
        rotation={[0.0, 0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[-192.494614, 2.666658, -21.779037]}
        rotation={[0.0, 0.785398, 0.0]}
        speed={0.9}
      />
      <Windmill
        position={[-201.742599, 2.666658, -21.779037]}
        rotation={[0.0, 0.785398, 0.0]}
        speed={0.9}
      />

      <Billboard position={[10, 6, 15.3]} rotation={[0, 0, 0]} />
    </>
  );
}

export default MainSceneProps;
