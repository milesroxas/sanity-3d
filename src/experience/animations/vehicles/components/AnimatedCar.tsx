import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { SHARED_PATH_POINTS } from '../lib/sharedPath';

interface AnimatedCarProps {
  pathOffset?: number; // Offset in the path array (0-1)
}

export function AnimatedCar({ pathOffset = 0 }: AnimatedCarProps) {
  const vehicles = useVehiclesInstances();
  const CarSedan = vehicles['car-sedan'];

  return (
    <CarSedan
      animation={{
        path: SHARED_PATH_POINTS,
        speed: 12,
        loop: true,
        pathOffset,
      }}
    />
  );
}
