import { usePerfStore } from '@/experience/scenes/store/perfStore';
import { EffectComposer, Vignette } from '@react-three/postprocessing';

export default function PostProcessing() {
  const declined = usePerfStore(state => state.declined);
  return (
    <EffectComposer>
      <Vignette offset={0.1} darkness={0.6} />
      {/* <ChromaticAberration
        blendFunction={BlendFunction.NORMAL} // blend mode
        offset={[0.002, 0.0002]} // color offset
      />
      <DepthOfField focusDistance={0.01} focalLength={0.01} bokehScale={1.5} height={480} />
      <Bloom
        intensity={1.5} // The bloom intensity.
        threshold={0.1} // Adjusts the effect band.
        levels={3} // The number of nested bloom passes.
      /> */}

      {/* <BrightnessContrast brightness={0.03} contrast={0.26} /> */}
    </EffectComposer>
  );
}
