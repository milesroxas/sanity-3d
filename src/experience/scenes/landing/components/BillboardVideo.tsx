import { useVideoTexture } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

export function BillboardVideo() {
  const texture = useVideoTexture(
    'https://stream.mux.com/w84bWAzWwgztieQJnHWMTV00I1edFcOgQhfpji9k24vk.m3u8'
  );

  async function warmup(texture: THREE.VideoTexture) {
    const video = texture.image as HTMLVideoElement;

    await video.play();
    setTimeout(() => {
      video.pause();
      video.currentTime = 0;
    }, 0);
  }

  useEffect(() => {
    warmup(texture).catch(err => console.log('warmup failed', err));
  }, [texture]);

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
