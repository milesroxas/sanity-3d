import { folder, useControls } from 'leva';

export const usePlayerControls = (
  initialPosition: { x: number; y: number; z: number },
  initialRotation: { x: number; y: number; z: number },
  initialScale: number,
  initialDistanceFactor: number,
  initialDimensions: { width: number; height: number }
) => {
  return useControls(
    'Player Settings',
    {
      position: folder({
        positionX: {
          value: initialPosition.x,
          min: -50,
          max: 50,
          step: 0.1,
          label: 'Position X',
        },
        positionY: {
          value: initialPosition.y,
          min: -50,
          max: 50,
          step: 0.1,
          label: 'Position Y',
        },
        positionZ: {
          value: initialPosition.z,
          min: -50,
          max: 50,
          step: 0.1,
          label: 'Position Z',
        },
      }),
      rotation: folder({
        rotationX: {
          value: initialRotation.x,
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
          label: 'Rotation X (Pitch)',
        },
        rotationY: {
          value: initialRotation.y,
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
          label: 'Rotation Y (Yaw)',
        },
        rotationZ: {
          value: initialRotation.z,
          min: -Math.PI,
          max: Math.PI,
          step: 0.01,
          label: 'Rotation Z (Roll)',
        },
      }),
      scaling: folder({
        scale: {
          value: initialScale,
          min: 0.1,
          max: 2,
          step: 0.05,
          label: 'Scale',
        },
        distanceFactor: {
          value: initialDistanceFactor,
          min: 1,
          max: 20,
          step: 0.5,
          label: 'Distance Factor',
        },
      }),
      dimensions: folder({
        width: {
          value: initialDimensions.width,
          min: 200,
          max: 1200,
          step: 50,
          label: 'Width (px)',
        },
        height: {
          value: initialDimensions.height,
          min: 100,
          max: 800,
          step: 25,
          label: 'Height (px)',
        },
      }),
    },
    { collapsed: true }
  );
};
