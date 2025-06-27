import { usePerfStore } from '@/experience/scenes/store/perfStore';
import { EffectComposer, Vignette } from '@react-three/postprocessing';

export default function PostProcessing() {
  const declined = usePerfStore(state => state.declined);
  return (
    <EffectComposer>
      <Vignette offset={0.1} darkness={0.6} />
    </EffectComposer>
  );
}
