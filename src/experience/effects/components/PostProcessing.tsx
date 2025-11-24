import { usePerfStore } from '@/experience/scenes/store/perfStore';

import {
  BrightnessContrast,
  EffectComposer,
  FXAA,
  SMAA,
  ToneMapping,
} from '@react-three/postprocessing';
import * as THREE from 'three';

export default function PostProcessing() {
  const declined = usePerfStore(state => state.declined);

  return (
    // Progressive enhancement: prefer SMAA (better edges); fall back to FXAA when declined
    <EffectComposer enabled multisampling={0}>
      <ToneMapping toneMapping={THREE.ACESFilmicToneMapping} />
      <BrightnessContrast brightness={0.14} contrast={0.06} />
      {declined ? <FXAA /> : <SMAA />}
      {/* <Vignette offset={0.1} darkness={0.6} /> */}
    </EffectComposer>
  );
}
