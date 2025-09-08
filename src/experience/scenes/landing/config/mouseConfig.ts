// Mouse interaction configuration
export const MOUSE_CONFIG = {
  influence: 1.5,
  dampingFactor: 0.05,
  uiDampingFactor: 0.8,
  // Stronger damping used briefly when exiting to quickly settle camera offset
  exitDampingFactor: 1.5,
} as const;
