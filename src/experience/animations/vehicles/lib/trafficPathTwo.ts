import pathData from '@/experience/data/traffic-path-two.json';

// Static position offset for all vehicles
export const TRAFFIC_TWO_VEHICLE_OFFSET = {
  x: -0.7,
  y: 2.5,
  z: 71,
};

// Pre-calculate the base path points
export const TRAFFIC_PATH_TWO_POINTS = pathData.points.map(
  p =>
    [
      p.x + TRAFFIC_TWO_VEHICLE_OFFSET.x,
      p.y + TRAFFIC_TWO_VEHICLE_OFFSET.y,
      p.z + TRAFFIC_TWO_VEHICLE_OFFSET.z,
    ] as [number, number, number]
);
