import { useControls } from 'leva';

export const useLinksControls = (initialPosition: { x: number; y: number; z: number }) => {
  return useControls(
    'Links Settings',
    {
      positionX: { value: initialPosition.x, step: 0.1 },
      positionY: { value: initialPosition.y, step: 0.1 },
      positionZ: { value: initialPosition.z, step: 0.1 },
    },
    { collapsed: true }
  );
};
