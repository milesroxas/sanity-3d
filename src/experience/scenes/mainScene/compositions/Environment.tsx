import { BlenderExportData } from '@/experience/baseModels/shared/types';
import mountainData from '@/experience/data/mountains.json';
import natureData from '@/experience/data/nature-2.json';
import {
  MountainInstances,
  MountainInstances_Blender,
} from '@/experience/models/MountainInstances';
import { NatureInstances, NatureInstances_Blender } from '@/experience/models/NatureInstances';
import { Environment as DreiEnvironment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { button, useControls } from 'leva';
import { useEffect } from 'react';
import * as THREE from 'three';

type EnvironmentPreset =
  | 'sunset'
  | 'dawn'
  | 'night'
  | 'warehouse'
  | 'forest'
  | 'apartment'
  | 'studio'
  | 'city'
  | 'park'
  | 'lobby';

// Cinematic lighting presets - Soft, luminous aesthetic
const LIGHTING_PRESETS = {
  'Desert Day': {
    ambientIntensity: 0.3,
    ambientColor: '#ffffff',
    sunIntensity: 0.5,
    sunColor: '#ffffff',
    sunPosition: { x: -20, y: 50, z: 15 },
    envIntensity: 0.3,
  },
  'Golden Hour': {
    ambientIntensity: 0.35,
    ambientColor: '#ffd4a3',
    sunIntensity: 2.2,
    sunColor: '#ffb366',
    sunPosition: { x: -25, y: 10, z: 15 },
    envIntensity: 0.9,
  },
  'Hot Noon': {
    ambientIntensity: 0.6,
    ambientColor: '#fffff0',
    sunIntensity: 2.0,
    sunColor: '#fffff8',
    sunPosition: { x: 0, y: 60, z: 5 },
    envIntensity: 0.7,
  },
  Sunset: {
    ambientIntensity: 0.3,
    ambientColor: '#ffcba4',
    sunIntensity: 1.5,
    sunColor: '#ff8c42',
    sunPosition: { x: -30, y: 5, z: 10 },
    envIntensity: 0.8,
  },
  Night: {
    ambientIntensity: 0.2,
    ambientColor: '#2a3f5f',
    sunIntensity: 0.4,
    sunColor: '#b8d4ff',
    sunPosition: { x: 5, y: 40, z: -15 },
    envIntensity: 0.4,
  },
  Overcast: {
    ambientIntensity: 0.7,
    ambientColor: '#f0e8dc',
    sunIntensity: 0.6,
    sunColor: '#e8dcc8',
    sunPosition: { x: 0, y: 30, z: 0 },
    envIntensity: 0.5,
  },
};

export function Environment() {
  // Lighting Presets with quick apply buttons
  useControls(
    '🌵 Palm Springs Lighting',
    {
      'Desert Day': button(() => applyPreset('Desert Day')),
      'Golden Hour': button(() => applyPreset('Golden Hour')),
      'Hot Noon': button(() => applyPreset('Hot Noon')),
      Sunset: button(() => applyPreset('Sunset')),
      Night: button(() => applyPreset('Night')),
      Overcast: button(() => applyPreset('Overcast')),
    },
    { collapsed: false }
  );

  // Environment Map Controls
  const [
    { useCustomHDR, preset, showBackground, backgroundBlur, envIntensity, envRotationY },
    setEnvControls,
  ] = useControls(
    '🌍 Environment Map',
    () => ({
      useCustomHDR: { value: true, label: 'Use Custom HDR' },
      preset: {
        value: 'city' as EnvironmentPreset,
        options: [
          'sunset',
          'dawn',
          'night',
          'warehouse',
          'forest',
          'apartment',
          'studio',
          'city',
          'park',
          'lobby',
        ] as EnvironmentPreset[],
      },
      showBackground: { value: true, label: 'Show as Background' },
      backgroundBlur: { value: 0.9, min: 0, max: 1, step: 0.01, label: 'Background Blur' },
      envIntensity: { value: 0.3, min: 0, max: 3, step: 0.05, label: 'Environment Intensity' },
      envRotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Rotation Y' },
    }),
    { collapsed: true }
  );

  // Ambient Light Controls - Soft, luminous fill light
  const [{ ambientIntensity, ambientColor }, setAmbientControls] = useControls(
    '💡 Ambient Light',
    () => ({
      ambientIntensity: { value: 1.8, min: 0, max: 2, step: 0.05, label: 'Intensity' },
      ambientColor: { value: '#cebe9d', label: 'Color' },
    }),
    { collapsed: true }
  );

  // Directional Light (Sun) Controls - Soft key light
  const [{ sunEnabled, sunIntensity, sunColor, sunPosition, castShadows }, setSunControls] =
    useControls(
      '☀️ Desert Sun',
      () => ({
        sunEnabled: { value: true, label: 'Enabled' },
        sunIntensity: { value: 2.8, min: 0, max: 5, step: 0.1, label: 'Intensity' },
        sunColor: { value: '#ffffff', label: 'Color' },
        sunPosition: {
          value: { x: -20, y: 50, z: 15 },
          step: 1,
          label: 'Position',
        },
        castShadows: { value: true, label: 'Cast Shadows' },
      }),
      { collapsed: true }
    );

  // Fog Controls for depth - subtle atmospheric haze
  // Camera is ~250 units from scene center, city spans ~-100 to +100
  // So fog should start beyond the city and fade distant mountains
  const { fogEnabled, fogColor, fogNear, fogFar } = useControls(
    '🌫️ Atmospheric Depth',
    {
      fogEnabled: { value: true, label: 'Enabled' },
      fogColor: { value: '#f8f5f0', label: 'Haze Color' },
      fogNear: { value: 150, min: 0, max: 500, step: 10, label: 'Near Distance' },
      fogFar: { value: 900, min: 100, max: 1000, step: 20, label: 'Far Distance' },
    },
    { collapsed: true }
  );

  // Function to apply lighting presets
  const applyPreset = (presetName: keyof typeof LIGHTING_PRESETS) => {
    const preset = LIGHTING_PRESETS[presetName];
    setAmbientControls({
      ambientIntensity: preset.ambientIntensity,
      ambientColor: preset.ambientColor,
    });
    setSunControls({
      sunIntensity: preset.sunIntensity,
      sunColor: preset.sunColor,
      sunPosition: preset.sunPosition,
    });
    setEnvControls({
      envIntensity: preset.envIntensity,
    });
  };

  // Apply fog to the scene
  const { scene } = useThree();
  useEffect(() => {
    if (fogEnabled) {
      scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    } else {
      scene.fog = null;
    }
  }, [fogEnabled, fogColor, fogNear, fogFar, scene]);

  return (
    <>
      <DreiEnvironment
        {...(useCustomHDR ? { files: '/textures/desert-clear-sky.hdr' } : { preset: preset })}
        background={showBackground}
        backgroundBlurriness={backgroundBlur}
        environmentIntensity={envIntensity}
        environmentRotation={[0, envRotationY, 0]}
      />

      {/* Ambient Light - provides overall scene illumination */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      {/* Directional Light - simulates sun/moon */}
      {sunEnabled && (
        <directionalLight
          position={[sunPosition.x, sunPosition.y, sunPosition.z]}
          intensity={sunIntensity}
          color={sunColor}
          castShadow={castShadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
          shadow-bias={-0.0001}
        />
      )}
      <MountainInstances useSharedMaterial={true} category="nature">
        <MountainInstances_Blender instancesData={mountainData as BlenderExportData[]} />
      </MountainInstances>

      <NatureInstances useSharedMaterial={true} category="nature">
        <NatureInstances_Blender instancesData={natureData as BlenderExportData[]} />
      </NatureInstances>
    </>
  );
}
