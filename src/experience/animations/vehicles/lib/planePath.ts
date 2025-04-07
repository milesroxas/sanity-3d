import planePathData from '@/experience/data/plane-path.json';

// Convert the path points to the format expected by the animation system
export const PLANE_PATH_POINTS = planePathData.points.map(point => [point.x, point.y, point.z]) as [
  number,
  number,
  number,
][];
