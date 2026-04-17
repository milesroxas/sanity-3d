import { SHARED_ATLAS_TEXTURES } from '@/experience/utils/materialUtils';
import { useTexture } from '@react-three/drei';

export function useSharedTextures() {
  const textures = useTexture({ ...SHARED_ATLAS_TEXTURES });

  return textures;
}
