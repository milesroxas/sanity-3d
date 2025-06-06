import { EffectComposer, Vignette } from '@react-three/postprocessing';

export function Effects() {
  return (
    <EffectComposer>
      <Vignette offset={0.1} darkness={0.6} />
    </EffectComposer>
  );
}
