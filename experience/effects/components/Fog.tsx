import { useControls } from 'leva';

export default function Fog() {
  const fogControls = useControls(
    'Fog',
    {
      color: { value: '#ffffff' },
      near: { value: 80, min: -100, max: 100, step: 1 },
      far: { value: 1000, min: 0, max: 2000, step: 10 },
    },
    { collapsed: true }
  );

  return <fog attach="fog" args={[fogControls.color, fogControls.near, fogControls.far]} />;
}
