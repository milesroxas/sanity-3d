import { VehiclesInstances, useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { Line } from '@react-three/drei';
import { useMemo } from 'react';

/**
 * Example component demonstrating the path animation system
 * Shows multiple vehicles following the same path with different offsets
 */
export function AnimatedPathExample() {
  const vehicles = useVehiclesInstances();

  // Create path points
  const pathPoints = useMemo(() => {
    return [
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 2],
      [0, 0, 3],
      [0, 0, 4],
      [0, 0, 5],
      [0, 0, 6],
      [0, 0, 7],
    ] as [number, number, number][];
  }, []);

  return (
    <group>
      {/* Visualize the path */}
      <Line points={pathPoints.flat()} color="red" lineWidth={2} dashed={false} />

      {/* Vehicles following the path with different offsets */}
      <VehiclesInstances useSharedMaterial={true}>
        {/* First car starts at the beginning */}
        <vehicles.AnimatedCar
          pathOffset={0}
          animation={{
            path: pathPoints,
            speed: 1,
            loop: true,
          }}
        />

        {/* Second car starts 1/3 through the path */}
        <vehicles.AnimatedPatrolOne
          pathOffset={0.33}
          animation={{
            path: pathPoints,
            speed: 1,
            loop: true,
          }}
        />

        {/* Third car starts 2/3 through the path */}
        <vehicles.AnimatedCar
          pathOffset={0.66}
          animation={{
            path: pathPoints,
            speed: 1,
            loop: true,
          }}
        />
      </VehiclesInstances>
    </group>
  );
}
