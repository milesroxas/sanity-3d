import * as THREE from 'three';

/**
 * Texture Preloader Utility
 *
 * Memoizes and pre-loads textures to ensure they're cached before use.
 * Prevents unnecessary re-loading and optimizes texture configuration.
 *
 * Features:
 * - Singleton texture cache (memoization)
 * - Automatic texture optimization (flipY, colorSpace, mipmaps)
 * - Promise-based loading for integration with loading screens
 * - Memory-efficient texture disposal on cleanup
 */

// Texture cache - single source of truth
const textureCache = new Map<string, THREE.Texture>();

// Loading promises cache - prevents duplicate loads
const loadingPromises = new Map<string, Promise<THREE.Texture>>();

// Texture loader singleton
let textureLoader: THREE.TextureLoader | null = null;

/**
 * Get or create the texture loader instance
 */
function getTextureLoader(): THREE.TextureLoader {
  if (!textureLoader) {
    textureLoader = new THREE.TextureLoader();
  }
  return textureLoader;
}

/**
 * Configure texture with optimal settings for the scene
 */
function configureTexture(texture: THREE.Texture): void {
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
}

/**
 * Pre-load a single texture and cache it
 *
 * @param url - Path to the texture file
 * @returns Promise that resolves to the loaded texture
 */
export function preloadTexture(url: string): Promise<THREE.Texture> {
  // Return cached texture if already loaded
  if (textureCache.has(url)) {
    return Promise.resolve(textureCache.get(url)!);
  }

  // Return existing loading promise if currently loading
  if (loadingPromises.has(url)) {
    return loadingPromises.get(url)!;
  }

  // Create new loading promise
  const loader = getTextureLoader();
  const loadingPromise = new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      url,
      texture => {
        configureTexture(texture);
        textureCache.set(url, texture);
        loadingPromises.delete(url);
        resolve(texture);
      },
      undefined,
      error => {
        loadingPromises.delete(url);
        console.error(`Failed to load texture: ${url}`, error);
        reject(error);
      }
    );
  });

  loadingPromises.set(url, loadingPromise);
  return loadingPromise;
}

/**
 * Pre-load multiple textures in parallel
 *
 * @param urls - Array of texture paths
 * @returns Promise that resolves when all textures are loaded
 */
export function preloadTextures(urls: string[]): Promise<THREE.Texture[]> {
  return Promise.all(urls.map(url => preloadTexture(url)));
}

/**
 * Get a cached texture (must be pre-loaded first)
 *
 * @param url - Path to the texture file
 * @returns The cached texture or undefined if not loaded
 */
export function getCachedTexture(url: string): THREE.Texture | undefined {
  return textureCache.get(url);
}

/**
 * Check if a texture is already loaded
 *
 * @param url - Path to the texture file
 * @returns True if texture is cached
 */
export function isTextureLoaded(url: string): boolean {
  return textureCache.has(url);
}

/**
 * Clear the texture cache and dispose of all textures
 * Call this when cleaning up the scene
 */
export function clearTextureCache(): void {
  textureCache.forEach(texture => {
    texture.dispose();
  });
  textureCache.clear();
  loadingPromises.clear();
}

/**
 * Get all texture URLs that are currently loaded
 */
export function getLoadedTextureUrls(): string[] {
  return Array.from(textureCache.keys());
}

/**
 * Pre-load all textures used in the texture swap feature
 * This should be called during app initialization
 *
 * NOTE: This utility is provided for advanced use cases.
 * For most React components, use TexturePreloader component instead
 * which integrates with drei's loading manager and Loading screen.
 */
export async function preloadSwapTextures(): Promise<{
  defaultTexture: THREE.Texture;
  activeTexture: THREE.Texture;
}> {
  // Import texture paths from single source of truth
  // This is a dynamic import to avoid circular dependencies
  const { DEFAULT_TEXTURE_PATH, ACTIVE_TEXTURE_PATH } = await import(
    '@/experience/constants/textures'
  );

  const [defaultTexture, activeTexture] = await preloadTextures([
    DEFAULT_TEXTURE_PATH,
    ACTIVE_TEXTURE_PATH,
  ]);

  return {
    defaultTexture,
    activeTexture,
  };
}
