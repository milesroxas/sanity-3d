import { useControls } from 'leva';

export const useDebugControls = () => {
  return useControls('Debug Controls', {
    enabled: false,
  });
};

export const useSceneInfoControls = (
  width: number,
  height: number,
  isMouseInteractionActive: boolean
) => {
  return useControls('Scene Info', {
    deviceInfo: {
      value: `${width}x${height} | ${width < 768 ? 'Mobile' : width < 1024 ? 'Tablet' : 'Desktop'}`,
      editable: false,
    },
    mouseInteractionActive: {
      value: isMouseInteractionActive,
      editable: false,
    },
  });
};
