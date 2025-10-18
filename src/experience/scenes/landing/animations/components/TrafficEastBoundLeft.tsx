import { useVehiclesInstances } from '@/experience/models/VehiclesInstances';
import { TRAFFIC_EAST_BOUND_LEFT_LANE_PATH_POINTS } from '../lib/trafficEastBoundLeft';
interface TrafficEastBoundLeftProps {
  pathOffset?: number; // Offset in the path array (0-1)
}

export function TrafficEastBoundLeft({ pathOffset = 0 }: TrafficEastBoundLeftProps) {
  const vehicles = useVehiclesInstances();
  const CarSedanWhite = vehicles['car-sedan-white'];
  const CarSedanRed = vehicles['car-sedan-red'];
  const CarSedanBlue = vehicles['car-sedan-blue'];
  const HippieVan = vehicles['hippie-van'];
  const Truck = vehicles['truck'];
  return (
    <>
      <CarSedanWhite
        animation={{
          path: TRAFFIC_EAST_BOUND_LEFT_LANE_PATH_POINTS,
          speed: 8,
          loop: false,
          pathOffset: (pathOffset + 0.2) % 1,
        }}
      />
      <CarSedanBlue
        animation={{
          path: TRAFFIC_EAST_BOUND_LEFT_LANE_PATH_POINTS,
          speed: 8,
          loop: false,
          pathOffset: (pathOffset + 0.25) % 1,
        }}
      />
      <Truck
        animation={{
          path: TRAFFIC_EAST_BOUND_LEFT_LANE_PATH_POINTS,
          speed: 8,
          loop: false,
          pathOffset: (pathOffset + 0.3) % 1,
        }}
      />
      <HippieVan
        animation={{
          path: TRAFFIC_EAST_BOUND_LEFT_LANE_PATH_POINTS,
          speed: 8,
          loop: false,
          pathOffset: (pathOffset + 0.35) % 1,
        }}
      />
    </>
  );
}
