import { useControls } from 'leva';

export const useBillboardControls = (
  initialPosition: { x: number; y: number; z: number },
  initialScale: number
) => {
  return useControls(
    'Billboard Settings',
    {
      positionX: { value: initialPosition.x, step: 0.1 },
      positionY: { value: initialPosition.y, step: 0.1 },
      positionZ: { value: initialPosition.z, step: 0.1 },
      scale: {
        value: initialScale,
        min: 0.1,
        max: 2,
        step: 0.1,
      },
    },
    { collapsed: true }
  );
};
