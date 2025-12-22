import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Custom shader material for paint coating texture transitions
 *
 * Creates a smooth cross-fade between two textures with an organic paint coating effect.
 * Uses noise to create irregular transition edges that simulate paint spreading across surfaces.
 *
 * Usage with drei:
 * ```tsx
 * <textureTransitionMaterial
 *   uTextureDefault={defaultTexture}
 *   uTextureActive={activeTexture}
 *   uProgress={0.5}
 * />
 * ```
 *
 * Or imperatively:
 * ```tsx
 * const material = new TextureTransitionMaterial({
 *   uTextureDefault: defaultTexture,
 *   uTextureActive: activeTexture,
 *   uProgress: 0.5,
 * });
 * ```
 *
 * Uniforms:
 * - uTextureDefault: The default/muted texture
 * - uTextureActive: The active texture (paint coating)
 * - uProgress: Transition progress (0 = default, 1 = active)
 * - uNoiseScale: Controls noise detail level (default: 8.0)
 * - uNoiseStrength: Controls noise influence on transition (default: 0.4)
 * - uTime: For animated noise movement
 */
export const TextureTransitionMaterial = shaderMaterial(
  // Uniforms
  {
    uTextureDefault: new THREE.Texture(),
    uTextureActive: new THREE.Texture(),
    uProgress: 0,
    uNoiseScale: 8.0,
    uNoiseStrength: 0.4,
    uTime: 0,
  },
  // Vertex Shader
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  /* glsl */ `
    uniform sampler2D uTextureDefault;
    uniform sampler2D uTextureActive;
    uniform float uProgress;
    uniform float uNoiseScale;
    uniform float uNoiseStrength;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Improved 2D noise function (Perlin-like)
    vec2 hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(
        mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    // Fractal Brownian Motion for organic paint coating effect
    // Creates layered noise that simulates paint spreading irregularly
    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      // 5 octaves for more detail
      for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }

      return value;
    }

    // Paint coating edge function
    // Creates irregular edges that simulate paint spreading
    float paintEdge(vec2 uv, float progress, float time) {
      // Animate noise over time for organic movement
      vec2 noiseCoord = uv * uNoiseScale + time * 0.05;
      
      // Layer multiple noise frequencies for complex paint patterns
      float noise1 = fbm(noiseCoord);
      float noise2 = fbm(noiseCoord * 1.5 + vec2(time * 0.03));
      float noise3 = fbm(noiseCoord * 0.5 - vec2(time * 0.02));
      
      // Combine noise layers
      float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
      
      // Apply noise to progress for irregular paint coating edge
      float edge = progress + combinedNoise * uNoiseStrength;
      
      return edge;
    }

    void main() {
      // Sample both textures
      vec4 texDefault = texture2D(uTextureDefault, vUv);
      vec4 texActive = texture2D(uTextureActive, vUv);

      // Calculate paint coating edge with noise
      float edge = paintEdge(vUv, uProgress, uTime);

      // Create smooth transition with paint coating effect
      // Use smoothstep for soft edges, but with wider range for paint-like spread
      float mixFactor = smoothstep(0.0, 1.0, edge);

      // Add subtle edge highlight to simulate wet paint
      float edgeHighlight = 0.0;
      if (uProgress > 0.01 && uProgress < 0.99) {
        // Detect edge region
        float edgeWidth = 0.1;
        float edgeDist = abs(edge - 0.5) * 2.0;
        edgeHighlight = smoothstep(1.0, 0.7, edgeDist) * 0.15 * (1.0 - abs(uProgress - 0.5) * 2.0);
      }

      // Mix between default and active textures
      vec4 finalColor = mix(texDefault, texActive, mixFactor);
      
      // Add edge highlight for paint coating effect
      finalColor.rgb += edgeHighlight;

      gl_FragColor = finalColor;

      // Include tone mapping and color space conversion
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

// Extend R3F to recognize our custom material
extend({ TextureTransitionMaterial });

// TypeScript declarations for JSX usage
declare module '@react-three/fiber' {
  interface ThreeElements {
    textureTransitionMaterial: any;
  }
}

/**
 * Type definition for the material instance
 * This allows TypeScript to understand the material's properties and uniforms
 */
export type TextureTransitionMaterialType = THREE.ShaderMaterial & {
  uniforms: {
    uTextureDefault: { value: THREE.Texture };
    uTextureActive: { value: THREE.Texture };
    uProgress: { value: number };
    uNoiseScale: { value: number };
    uNoiseStrength: { value: number };
    uTime: { value: number };
  };
};
