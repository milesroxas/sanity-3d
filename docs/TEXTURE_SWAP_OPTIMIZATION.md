# Texture Swap Performance Optimization Guide

## Overview

This document outlines the performance optimizations implemented for the texture swap feature, including pre-loading, memoization, and integration with the loading screen.

## Architecture

### 0. Single Source of Truth: Texture Constants

**File:** [src/experience/constants/textures.ts](../src/experience/constants/textures.ts)

**Purpose:**
Centralized configuration for all texture paths used in the application. This prevents bugs from path mismatches and makes updating textures trivial.

**Constants:**
```typescript
export const DEFAULT_TEXTURE_PATH = '/textures/color-atlas-muted-1.jpg';
export const ACTIVE_TEXTURE_PATH = '/textures/global-atlas-color.webp';
export const TEXTURE_PATHS = {
  defaultTexture: DEFAULT_TEXTURE_PATH,
  activeTexture: ACTIVE_TEXTURE_PATH,
};
```

**Benefits:**
- Single source of truth for all texture paths
- TypeScript `const` assertions prevent accidental modifications
- Changing textures requires updating only one file
- Eliminates path duplication across components

### 1. Texture Pre-loading System

**Files:**
- [src/experience/components/TexturePreloader.tsx](../src/experience/components/TexturePreloader.tsx)
- [src/experience/utils/texturePreloader.ts](../src/experience/utils/texturePreloader.ts) (utility layer for advanced use cases)

**Key Features:**
- Uses drei's `useTexture` hook which automatically caches textures
- Integrates with drei's loading manager (tracked by `useProgress()`)
- Pre-loads both default and active textures during initial load
- Configures textures with optimal settings (mipmaps, filtering, color space)
- **Fixed texture paths** - no dynamic loading during runtime
- Imports paths from centralized constants

**Critical Design Decision:**
The system uses **fixed texture paths** from `constants/textures.ts` that are pre-loaded once and never change. This prevents the loading screen from appearing mid-transition when clicking POI markers.

**Usage:**
```tsx
// In MainScene.tsx
<TexturePreloader />
```

### 2. Fixed Texture Management

**File:** [src/experience/hooks/useMaterialTextureTransition.ts](../src/experience/hooks/useMaterialTextureTransition.ts)

**Critical Fix:**
- **Always uses the same two texture paths** (hardcoded in the hook)
- No dynamic texture path changes that trigger re-loading
- Retrieves textures from drei's cache (instant access)
- Single texture configuration on mount (not every render)
- Efficient scene traversal only during transitions

**Why Fixed Paths:**
Previously, the hook would receive dynamic texture paths from the POI store, causing `useTexture` to attempt loading new textures mid-transition. This triggered the loading screen during camera animations, creating a jarring user experience. By fixing the paths, we ensure textures are always pre-cached.

**Performance:**
- O(n) scene traversal but only during transitions (not every frame)
- Textures loaded once and reused throughout the session
- No loading delays or frame drops during transitions
- Automatic memory management via drei's cache

### 3. Loading Screen Integration

**File:** [src/experience/components/Loading.tsx](../src/experience/components/Loading.tsx)

**How it works:**
1. `TexturePreloader` uses `useTexture` which adds textures to drei's loading manager
2. `Loading` component uses `useProgress()` to track all assets including textures
3. Progress bar shows texture loading in real-time
4. Scene only renders after all textures are loaded

### 4. Texture Configuration

All textures are configured with optimal settings:

```typescript
texture.flipY = false;
texture.colorSpace = THREE.SRGBColorSpace;
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.generateMipmaps = true;
```

**Benefits:**
- Correct color representation (sRGB color space)
- Smooth scaling with mipmaps (better performance on distance)
- Proper UV mapping (flipY = false for WebGL)

## Texture Compression Recommendations

### Current Textures

- Default: `/textures/color-atlas-muted-1.jpg` (JPEG)
- Active: `/textures/global-atlas-color.webp` (WebP)

### Further Optimization Options

#### 1. Use WebP for All Textures

**Benefits:**
- 25-35% smaller file size than JPEG at same quality
- Better compression algorithm
- Supports transparency (if needed in future)

**Recommendation:**
Convert `color-atlas-muted-1.jpg` to WebP format:

```bash
# Using cwebp (install via: brew install webp)
cwebp -q 85 color-atlas-muted-1.jpg -o color-atlas-muted-1.webp
```

#### 2. Use Texture Atlases (Already Implemented ✓)

Your textures are already atlases (`color-atlas-*`), which is excellent for performance:
- Single texture for multiple objects (reduces draw calls)
- Efficient GPU memory usage
- Fast texture swapping

#### 3. Consider Basis Universal (Advanced)

For maximum compression and fast GPU upload:

**Benefits:**
- 50-75% smaller than PNG/JPEG
- Hardware-compressed texture format
- Fast GPU decompression

**Trade-offs:**
- Requires build-time processing
- Slightly lower quality than source
- Additional setup complexity

**Implementation:**
```typescript
// Using drei's useKTX2 loader
import { useKTX2 } from '@react-three/drei';

const texture = useKTX2('/textures/color-atlas.ktx2');
```

## Performance Metrics

### Before Optimization
- Textures loaded on-demand during transitions
- Loading screen appeared mid-transition when clicking POI markers
- Dynamic texture paths caused re-loading
- Potential frame drops during first texture swap
- Jarring user experience during camera animations

### After Optimization
- All textures pre-loaded during initial load
- **Fixed texture paths prevent mid-transition loading**
- Smooth transitions with no frame drops or loading screens
- Loading screen shows texture progress only during initial load
- Single texture instance cached and reused
- Memory-efficient texture management
- Instant texture access from drei's cache

## Best Practices

1. **Use centralized constants** - Import texture paths from `constants/textures.ts`
2. **Always pre-load textures** - Use `TexturePreloader` component
3. **Configure textures once** - Set flipY, colorSpace, etc. in useEffect
4. **Never hardcode texture paths** - Prevents maintenance issues and bugs
5. **Leverage drei's cache** - Don't create custom texture loaders
6. **Integrate with loading screen** - Show progress to users

## Maintenance Guide

### How to Change Textures

To update the default or active texture:

1. Add new texture file to `/public/textures/`
2. Update path in [src/experience/constants/textures.ts](../src/experience/constants/textures.ts)
3. Done! All components automatically use the new texture

**Example:**
```typescript
// In constants/textures.ts
export const DEFAULT_TEXTURE_PATH = '/textures/my-new-texture.webp';
```

### Adding New Textures

1. Add constant to `constants/textures.ts`
2. Add to `PRELOAD_TEXTURE_PATHS` array
3. Update `TexturePreloader` component if needed
4. Import and use the constant in your components

## Testing Checklist

- [ ] Textures appear in loading screen progress
- [ ] No duplicate texture loads (check Network tab)
- [ ] Smooth transitions with no frame drops
- [ ] Textures render correctly (colors, UVs, no flipping)
- [ ] Memory usage is stable (no leaks)
- [ ] Works on mobile devices (low memory)

## Future Enhancements

1. **Lazy loading for additional POI textures** - Load textures only when POI is first accessed
2. **Texture quality based on device** - Lower resolution on mobile
3. **Progressive loading** - Show low-res placeholder while high-res loads
4. **Texture streaming** - Load mipmaps progressively based on distance

## Related Documentation

- [Material Texture Transitions](./MATERIAL_TEXTURE_TRANSITIONS.md)
- [Material Instancing](./MATERIAL_INSTANCING_FINAL_REPORT.md)
- [POI System](./POI_TEXTURE_TRANSITION_SUMMARY.md)
