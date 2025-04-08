import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { SHARED_PATH_POINTS } from '../lib/sharedPath';

interface AnimatedCarProps {
  pathOffset?: number; // Offset in the path array (0-1)
}

export function AnimatedCar({ pathOffset = 0 }: AnimatedCarProps) {
  const vehicles = useVehiclesInstances();
  const CarSedan = vehicles['car-sedan-white'];
  const CarSedanRed = vehicles['car-sedan-red'];
  const PatrolCar = vehicles['patrol-car'];
  const Taxi = vehicles['taxi'];
  const Truck = vehicles['truck'];

  return (
    <>
      <CarSedan
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 10,
          loop: true,
          pathOffset,
        }}
      />
      <CarSedanRed
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 10,
          loop: true,
          pathOffset: (pathOffset + 0.25) % 1,
        }}
      />
      <Taxi
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 10,
          loop: true,
          pathOffset: (pathOffset + 0.5) % 1,
        }}
      />
      <Truck
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 10,
          loop: true,
          pathOffset: (pathOffset + 0.75) % 1,
        }}
      />
      <PatrolCar
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 10,
          loop: true,
          pathOffset: (pathOffset + 0.65) % 1,
        }}
      />
    </>
  );
}
