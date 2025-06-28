import { useTexture } from '@react-three/drei';

export function useSharedTextures() {
  const textures = useTexture({
    colorMap: '/textures/color-atlas-new2.png',
    specularMap: '/textures/color-atlas-specular.png',
    emissionMap: '/textures/color-atlas-emission-night.png',
  });

  return textures;
}
