import { usePerfStore } from '@/experience/scenes/store/perfStore';
import { EffectComposer, FXAA, SMAA, Vignette } from '@react-three/postprocessing';

export function Effects() {
  const declined = usePerfStore(state => state.declined);
  return (
    <EffectComposer multisampling={0}>
      {declined ? <FXAA /> : <SMAA />}
      <Vignette offset={0.1} darkness={0.6} />
    </EffectComposer>
  );
}
