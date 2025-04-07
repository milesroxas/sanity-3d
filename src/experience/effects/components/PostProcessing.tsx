import { BrightnessContrast, EffectComposer, Vignette } from '@react-three/postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Vignette offset={0.1} darkness={0.4} />
      <BrightnessContrast brightness={0.0} contrast={0.16} />
    </EffectComposer>
  );
}
