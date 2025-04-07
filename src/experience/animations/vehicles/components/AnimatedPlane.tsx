import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { SHARED_PATH_POINTS } from '../lib/sharedPath';

interface AnimatedPlaneProps {
  pathOffset?: number; // Offset in the path array (0-1)
}

export function AnimatedPlane({ pathOffset = 0 }: AnimatedPlaneProps) {
  const vehicles = useVehiclesInstances();
  const Plane = vehicles['plane'];

  return (
    <Plane
      animation={{
        path: SHARED_PATH_POINTS,
        speed: 12,
        loop: true,
        pathOffset,
      }}
    />
  );
}
