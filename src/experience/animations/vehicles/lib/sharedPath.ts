import pathData from '@/experience/scenes/mainScene/lib/car_1_path.json';

// Static position offset for all vehicles
export const VEHICLE_OFFSET = {
  x: -70.3,
  y: 2.5,
  z: 79.6,
};

// Pre-calculate the base path points
export const SHARED_PATH_POINTS = pathData.points.map(
  p =>
    [p.x + VEHICLE_OFFSET.x, p.y + VEHICLE_OFFSET.y, p.z + VEHICLE_OFFSET.z] as [
      number,
      number,
      number,
    ]
);
