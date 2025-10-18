import pathData from '@/experience/scenes/landing/animations/lib/traffic-east-bound-right-lane.json';

// Static position offset for landing scene vehicles
export const TRAFFIC_EAST_BOUND_RIGHT_LANE_OFFSET = {
  x: 0,
  y: 0.4,
  z: 1,
};

// Pre-calculate the base path points
export const TRAFFIC_EAST_BOUND_RIGHT_LANE_PATH_POINTS = pathData.points.map(
  p =>
    [
      p.x + TRAFFIC_EAST_BOUND_RIGHT_LANE_OFFSET.x,
      p.y + TRAFFIC_EAST_BOUND_RIGHT_LANE_OFFSET.y,
      p.z + TRAFFIC_EAST_BOUND_RIGHT_LANE_OFFSET.z,
    ] as [number, number, number]
);
