import { Vector3 } from 'three';

/**
 * Camera domain configuration - Single source of truth for all camera-related values
 * Following Domain-Driven Design principles, this centralizes all camera constants
 */
export const CAMERA_CONFIG = {
  // Camera positions for different states
  positions: {
    mainIntro: {
      position: new Vector3(-20, 350, 5),
      target: new Vector3(-20, -100, 0),
    },
    main: {
      position: new Vector3(-16.12, 95.86, 250),
      target: new Vector3(-20.15, 22, 0),
    },
  },

  // Scene-specific constraints - Adjust these based on your scene boundaries
  constraints: {
    bounds: {
      minX: -300,
      maxX: 200,
      minY: -400,
      maxY: 400, // Increased from 300 to 400 to accommodate mainIntro position (350)
      minZ: -300,
      maxZ: 300,
    },
    distance: {
      min: 10,
      max: 500, // Set high enough to accommodate mainIntro distance (~450)
    },
    angles: {
      minPolar: 0,
      maxPolar: Math.PI / 2,
      minAzimuth: -Math.PI / 4,
      maxAzimuth: Math.PI / 4,
    },
  },

  // Animation settings
  animation: {
    introDuration: 6, // seconds
    introEase: 'power2.inOut',
  },
} as const;

// Backwards compatibility aliases for existing code
export const INITIAL_POSITIONS = CAMERA_CONFIG.positions;
export const CAMERA_CONSTRAINTS = {
  bounds: CAMERA_CONFIG.constraints.bounds,
  maxDistance: CAMERA_CONFIG.constraints.distance.max,
  minDistance: CAMERA_CONFIG.constraints.distance.min,
};
export const ANGLE_LIMITS = CAMERA_CONFIG.constraints.angles;
