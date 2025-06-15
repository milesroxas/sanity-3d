import { useControls } from 'leva';

export const useLogoControls = (
  initialPosition: { x: number; y: number; z: number },
  initialRotation: { x: number; y: number; z: number }
) => {
  return useControls(
    'Logo Settings',
    {
      positionX: { value: initialPosition.x, step: 0.1 },
      positionY: { value: initialPosition.y, step: 0.1 },
      positionZ: { value: initialPosition.z, step: 0.1 },
      rotationX: {
        value: initialRotation.x,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
      rotationY: {
        value: initialRotation.y,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
      rotationZ: {
        value: initialRotation.z,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
    },
    { collapsed: true }
  );
};
