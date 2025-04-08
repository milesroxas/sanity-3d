import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { PLANE_PATH_POINTS } from '../lib/planePath';

interface AnimatedPlaneProps {
  pathOffset?: number; // Offset in the path array (0-1), where 0 is start and 1 is end
  scale?: number; // Scale factor for the plane
}

export function AnimatedPlane({ pathOffset = 0.3, scale = 0.4 }: AnimatedPlaneProps) {
  const vehicles = useVehiclesInstances();
  const Plane = vehicles['plane-passenger'];

  return (
    <Plane
      animation={{
        path: PLANE_PATH_POINTS,
        speed: 15,
        loop: true,
        pathOffset,
      }}
      scale={[scale, scale, scale]}
    />
  );
}
