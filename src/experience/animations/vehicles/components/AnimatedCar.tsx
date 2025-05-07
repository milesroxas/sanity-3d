import { TRAFFIC_PATH_TWO_POINTS } from '@/experience/animations/vehicles/lib/trafficPathTwo';
import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { usePerfStore } from '@/experience/scenes/store/perfStore';
import { SHARED_PATH_POINTS } from '../lib/sharedPath';
interface AnimatedCarProps {
  pathOffset?: number; // Offset in the path array (0-1)
}

export function AnimatedCar({ pathOffset = 0 }: AnimatedCarProps) {
  const vehicles = useVehiclesInstances();
  const CarSedanWhite = vehicles['car-sedan-white'];
  const CarSedanRed = vehicles['car-sedan-red'];
  const CarSedanBlue = vehicles['car-sedan-blue'];
  const PatrolCar = vehicles['patrol-car'];
  const Taxi = vehicles['taxi'];
  const Truck = vehicles['truck'];
  const Bus = vehicles['city-bus'];
  const Jeep = vehicles['jeep'];
  const declined = usePerfStore(state => state.declined);
  return (
    <>
      <CarSedanWhite
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 8,
          loop: true,
          pathOffset,
        }}
      />
      <CarSedanRed
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 8,
          loop: true,
          pathOffset: (pathOffset + 0.25) % 1,
        }}
      />
      <Taxi
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 8,
          loop: true,
          pathOffset: (pathOffset + 0.5) % 1,
        }}
      />
      {!declined && (
        <Truck
          animation={{
            path: SHARED_PATH_POINTS,
            speed: 8,
            loop: true,
            pathOffset: (pathOffset + 0.75) % 1,
          }}
        />
      )}
      <PatrolCar
        animation={{
          path: SHARED_PATH_POINTS,
          speed: 8,
          loop: true,
          pathOffset: (pathOffset + 0.65) % 1,
        }}
      />

      <CarSedanBlue
        animation={{
          path: TRAFFIC_PATH_TWO_POINTS,
          speed: 8,
          loop: true,
        }}
      />
      <Bus
        animation={{
          path: TRAFFIC_PATH_TWO_POINTS,
          speed: 8,
          loop: true,
          pathOffset: (pathOffset + 0.25) % 1,
        }}
      />
      {!declined && (
        <Jeep
          animation={{
            path: TRAFFIC_PATH_TWO_POINTS,
            speed: 8,
            loop: true,
            pathOffset: (pathOffset + 0.75) % 1,
          }}
        />
      )}
    </>
  );
}
