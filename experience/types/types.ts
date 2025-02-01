export type MarkerPosition = {
  x: number;
  y: number;
  z: number;
};

export type Position = [number, number, number];

export const toPosition = (marker: MarkerPosition): Position => {
  return [marker.x, marker.y, marker.z];
};
