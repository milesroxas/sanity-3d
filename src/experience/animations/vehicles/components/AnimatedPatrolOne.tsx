import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { SHARED_PATH_POINTS } from '../lib/sharedPath';

interface AnimatedPatrolOneProps {
  pathOffset?: number; // Offset in the path array (0-1)
}

export function AnimatedPatrolOne({ pathOffset = 0 }: AnimatedPatrolOneProps) {
  const vehicles = useVehiclesInstances();
  const PatrolCar = vehicles['patrol-car'];

  return (
    <PatrolCar
      animation={{
        path: SHARED_PATH_POINTS,
        speed: 12,
        loop: true,
        pathOffset,
      }}
    />
  );
}
