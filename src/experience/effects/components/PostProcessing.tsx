import { usePerfStore } from '@/experience/scenes/store/perfStore';

import { BrightnessContrast, EffectComposer, FXAA, SMAA } from '@react-three/postprocessing';

export default function PostProcessing() {
  const declined = usePerfStore(state => state.declined);

  return (
    // Progressive enhancement: prefer SMAA (better edges); fall back to FXAA when declined
    <EffectComposer enabled multisampling={0}>
      <BrightnessContrast brightness={0.05} contrast={-0.1} />
      {declined ? <FXAA /> : <SMAA />}
      {/* <Vignette offset={0.1} darkness={0.6} /> */}
    </EffectComposer>
  );
}
