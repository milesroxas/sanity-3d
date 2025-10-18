import pathData from '@/experience/scenes/landing/animations/lib/patrol-path.json';

export const PATROL_CAR_OFFSET = {
  x: 2.5,
  y: -0.1,
  z: 0.75,
};

// Pre-calculate the base path points
export const PATROL_CAR_PATH_POINTS = pathData.points.map(
  p =>
    [p.x + PATROL_CAR_OFFSET.x, p.y + PATROL_CAR_OFFSET.y, p.z + PATROL_CAR_OFFSET.z] as [
      number,
      number,
      number,
    ]
);
