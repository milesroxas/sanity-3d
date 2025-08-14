import AnimatedClouds from './components/Clouds';
import Fog from './components/Fog';
import PostProcessing from './components/PostProcessing';
// Effects only; performance monitoring is centralized in R3FContext

export default function Effects() {
  return (
    <>
      {/* Fog remains configurable via Leva; keep it mounted */}
      <Fog />
      <AnimatedClouds />
      <PostProcessing />
    </>
  );
}
