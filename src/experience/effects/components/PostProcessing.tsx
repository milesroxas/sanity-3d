import { EffectComposer, Vignette } from '@react-three/postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Vignette offset={0.1} darkness={0.6} />
      {/* <BrightnessContrast brightness={0.03} contrast={0.26} /> */}
    </EffectComposer>
  );
}
