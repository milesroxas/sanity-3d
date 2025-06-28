import { useControls } from 'leva';

export const useMainContentControls = (initialPosition: { x: number; y: number; z: number }) => {
  return useControls(
    'Main Content Settings',
    {
      positionX: { value: initialPosition.x, step: 0.1 },
      positionY: { value: initialPosition.y, step: 0.1 },
      positionZ: { value: initialPosition.z, step: 0.1 },
    },
    { collapsed: true }
  );
};
