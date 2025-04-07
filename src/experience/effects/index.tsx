import AnimatedClouds from './components/Clouds';
import Fog from './components/Fog';
import PostProcessing from './components/PostProcessing';

export default function Effects() {
  return (
    <>
      <Fog />
      <AnimatedClouds />
      <PostProcessing />
    </>
  );
}
