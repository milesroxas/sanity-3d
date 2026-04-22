'use client';

import { useControls } from 'leva';
import { ChromaticAberrationEffect } from 'postprocessing';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';

export default function MainSceneChromaticAberration() {
  const { enabled, offsetX, offsetY, radialModulation, modulationOffset, opacity } = useControls(
    'Chromatic Aberration',
    {
      enabled: { value: true },
      offsetX: { value: 0.002, min: 0, max: 0.02, step: 0.0001, label: 'Offset X' },
      offsetY: { value: 0.002, min: 0, max: 0.02, step: 0.0001, label: 'Offset Y' },
      radialModulation: { value: true, label: 'Radial (edges)' },
      modulationOffset: {
        value: 0.15,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Edge falloff',
      },
      opacity: { value: .5, min: 0, max: 1, step: 0.01 },
    },
    { collapsed: true }
  );

  const effect = useMemo(
    () =>
      new ChromaticAberrationEffect({
        offset: new THREE.Vector2(0.002, 0.002),
        radialModulation: true,
        modulationOffset: 0.15,
      }),
    []
  );

  useLayoutEffect(() => {
    if (!enabled) return;
    effect.offset.set(offsetX, offsetY);
    if (effect.radialModulation !== radialModulation) {
      effect.radialModulation = radialModulation;
    }
    effect.modulationOffset = modulationOffset;
    effect.blendMode.opacity.value = opacity;
  }, [effect, enabled, offsetX, offsetY, radialModulation, modulationOffset, opacity]);

  useEffect(() => () => effect.dispose(), [effect]);

  if (!enabled) return null;

  return <primitive object={effect} />;
}
