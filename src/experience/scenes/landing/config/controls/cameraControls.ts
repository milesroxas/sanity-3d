import { useControls } from 'leva';

export const useCameraControls = (
  initialPosition: { x: number; y: number; z: number },
  initialTarget: { x: number; y: number; z: number },
  initialMouseInfluence: number,
  initialMouseDamping: number
) => {
  return useControls(
    'Camera Settings',
    {
      positionX: { value: initialPosition.x, step: 0.1 },
      positionY: { value: initialPosition.y, step: 0.1 },
      positionZ: { value: initialPosition.z, step: 0.1 },
      targetX: { value: initialTarget.x, step: 0.1 },
      targetY: { value: initialTarget.y, step: 0.1 },
      targetZ: { value: initialTarget.z, step: 0.1 },
      mouseInfluence: {
        value: initialMouseInfluence,
        min: 0,
        max: 5,
        step: 0.1,
      },
      mouseDamping: {
        value: initialMouseDamping,
        min: 0.01,
        max: 0.2,
        step: 0.005,
      },
    },
    { collapsed: true }
  );
};
