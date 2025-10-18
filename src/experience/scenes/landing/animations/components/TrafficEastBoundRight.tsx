import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { TRAFFIC_EAST_BOUND_RIGHT_LANE_PATH_POINTS } from '../lib/trafficEastBoundRight';

interface TrafficEastBoundRightProps {
  pathOffset?: number; // Offset in the path array (0-1)
}

export function TrafficEastBoundRight({ pathOffset = 0 }: TrafficEastBoundRightProps) {
  const vehicles = useVehiclesInstances();
  const CarSedanWhite = vehicles['car-sedan-white'];
  const CarSedanRed = vehicles['car-sedan-red'];
  const Taxi = vehicles['taxi'];
  const Truck = vehicles['truck'];
  const CampingVan = vehicles['camping-van'];
  return (
    <>
      <CampingVan
        animation={{
          path: TRAFFIC_EAST_BOUND_RIGHT_LANE_PATH_POINTS,
          speed: 6,
          loop: false,
          pathOffset: (pathOffset + 0.2) % 1,
        }}
      />
      <CarSedanRed
        animation={{
          path: TRAFFIC_EAST_BOUND_RIGHT_LANE_PATH_POINTS,
          speed: 6,
          loop: false,
          pathOffset: (pathOffset + 0.1) % 1,
        }}
      />
      <Taxi
        animation={{
          path: TRAFFIC_EAST_BOUND_RIGHT_LANE_PATH_POINTS,
          speed: 6,
          loop: false,
          pathOffset: (pathOffset + 0.13) % 1,
        }}
      />
    </>
  );
}
