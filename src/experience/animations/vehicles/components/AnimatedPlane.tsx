import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { PLANE_PATH_POINTS } from '../lib/planePath';

interface AnimatedPlaneProps {
  pathOffset?: number; // Offset in the path array (0-1)
  scale?: number; // Scale factor for the plane
}

export function AnimatedPlane({ pathOffset = 0.2, scale = 0.8 }: AnimatedPlaneProps) {
  const vehicles = useVehiclesInstances();
  const Plane = vehicles['plane-passenger'];

  return (
    <Plane
      scale={scale}
      animation={{
        path: PLANE_PATH_POINTS,
        speed: 18,
        loop: true,
        pathOffset,
      }}
    />
  );
}
