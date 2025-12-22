/**
 * Texture Constants
 *
 * Single source of truth for all texture paths used in the application.
 * Changing these values will update the textures everywhere they're used.
 *
 * IMPORTANT: These paths must match actual files in the public/textures directory.
 */

/**
 * Default muted texture used for the initial scene state
 */
export const DEFAULT_TEXTURE_PATH = '/textures/color-atlas-muted-1.jpg' as const;

/**
 * Active colored texture used when POIs are activated
 */
export const ACTIVE_TEXTURE_PATH = '/textures/global-atlas-color.webp' as const;

/**
 * Array of all texture paths that need to be pre-loaded
 * Add additional textures here if needed in the future
 */
export const PRELOAD_TEXTURE_PATHS = [
  DEFAULT_TEXTURE_PATH,
  ACTIVE_TEXTURE_PATH,
] as const;

/**
 * Texture configuration object for drei's useTexture hook
 */
export const TEXTURE_PATHS = {
  defaultTexture: DEFAULT_TEXTURE_PATH,
  activeTexture: ACTIVE_TEXTURE_PATH,
} as const;
