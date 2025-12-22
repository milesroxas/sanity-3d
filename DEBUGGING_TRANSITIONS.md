# Debugging Texture Transitions

## Quick Debugging Steps

I've added extensive console logging to help diagnose why textures aren't changing. Follow these steps:

### 1. Open Browser Console

Start your dev server and open the browser console (F12):

```bash
pnpm run dev
```

### 2. Check Console Logs on Page Load

You should see these logs when the scene loads:

```
[TextureTransition] Textures ready, replacing materials
[TextureTransition] Found atlas material: { meshName: "...", textureSrc: "..." }
[TextureTransition] Replaced X materials with shaders, skipped Y
[TextureTransition] Default texture: Texture { ... }
[TextureTransition] Active texture: Texture { ... }
```

**If you see**:
- `"Waiting for textures to load..."` → Textures haven't loaded yet (wait a moment)
- `"Textures not ready yet..."` → Texture images haven't loaded (check network tab)
- `"Replaced 0 materials"` → No materials found with atlas textures (see below)

### 3. Click a Logo Marker

When you click a marker, you should see:

```
[TextureTransition] Transition effect triggered: { isTransitioning: true, activePoi: "...", shaderMaterialCount: X }
[TextureTransition] Starting animation: { targetProgress: 1, materialCount: X }
[TextureTransition] Animating from 0 to 1
[TextureTransition] Animation started
[TextureTransition] Animation complete
```

**If you see**:
- `"No shader materials found!"` → Materials weren't replaced (see Issue #1 below)
- `shaderMaterialCount: 0` → Materials weren't replaced (see Issue #1 below)
- No logs at all → POI store isn't updating (see Issue #2 below)

---

## Common Issues & Solutions

### Issue #1: No Materials Replaced (Count = 0)

**Symptoms**:
```
[TextureTransition] Replaced 0 materials with shaders, skipped X
```

**Cause**: Materials don't match the atlas texture check

**Solution**: Check what textures your materials are actually using:

1. Add this temporary code to the hook (after line 65):

```typescript
// Temporary debugging - add after "Handle both single materials..."
materials.forEach((mat, idx) => {
  if (mat instanceof THREE.MeshStandardMaterial) {
    console.log(`Material ${idx}:`, {
      hasMap: !!mat.map,
      mapSrc: mat.map?.source.data?.src,
      mapImage: mat.map?.image,
    });
  }
});
```

2. Check the console output - you should see the texture paths

3. If the paths don't include `'color-atlas'`, update the check in the hook

### Issue #2: POI Store Not Updating

**Symptoms**: No transition logs when clicking marker

**Cause**: `setActivePoi` not being called or POI store not connected

**Solution**:

1. Check `LogoMarkers.tsx` line 293-301 - verify `setActivePoi` is called
2. Add temporary log in `LogoMarkers.tsx`:

```typescript
// In handleMarkerClick, after setActivePoi call:
console.log('[LogoMarkers] setActivePoi called:', {
  slug: poi.slug.current,
  defaultTex,
  activeTex,
});
```

3. Check POI store state:

```typescript
// Add to hook temporarily:
console.log('[TextureTransition] POI Store State:', {
  isTransitioning,
  activePoi,
  defaultTexturePath,
  activeTexturePath,
});
```

### Issue #3: Textures Not Loading

**Symptoms**:
```
[TextureTransition] Waiting for textures to load...
```
(and never progresses)

**Cause**: Texture files missing or paths incorrect

**Solution**:

1. Check texture files exist:
   - `/public/textures/color-atlas-muted-1.jpg`
   - `/public/textures/color-atlas-new2.png`

2. Check network tab in DevTools - look for 404 errors

3. Verify paths in POI store (`src/experience/stores/poiInstanceStore.ts`):

```typescript
defaultTexture: '/textures/color-atlas-muted-1.jpg',
activeTexture: '/textures/color-atlas-new2.png',
```

### Issue #4: Shader Material Created But No Visual Change

**Symptoms**: Materials replaced successfully, animation runs, but no visual change

**Cause**: Shader uniforms not updating or textures not bound correctly

**Solution**:

1. Check if `uProgress` is actually changing:

```typescript
// Add to updateProgress function:
console.log('[TextureTransition] Setting progress to:', progress);
```

2. Verify textures are bound to shader:

```typescript
// Add after material creation:
console.log('[TextureTransition] Shader material created:', {
  hasDefaultTex: !!shaderMat.uniforms.uTextureDefault.value,
  hasActiveTex: !!shaderMat.uniforms.uTextureActive.value,
  progress: shaderMat.uniforms.uProgress.value,
});
```

3. Check if shader is compiling correctly - look for WebGL errors in console

---

## Expected Behavior

### On Page Load
1. Textures load from drei cache
2. Scene traversal finds all meshes with atlas textures
3. Materials replaced with shader materials
4. Console shows: `"Replaced X materials with shaders"`

### On Logo Marker Click
1. `setActivePoi` called in LogoMarkers.tsx
2. POI store updates `isTransitioning` and `activePoi`
3. Hook detects change and starts GSAP animation
4. `uProgress` animates from 0 to 1 over 2 seconds
5. Shader cross-fades between textures with paint effect

### Visual Result
- Smooth transition from default to active texture
- Organic noise patterns create irregular paint edges
- Subtle animated movement from noise
- Edge highlights simulate wet paint

---

## Quick Test

Run this in browser console to manually trigger a transition:

```javascript
// Get the POI store
const store = window.__ZUSTAND_STORES__?.poiInstanceStore;

// Manually trigger transition
store?.setState({
  isTransitioning: true,
  activePoi: 'test',
});

// Check shader materials
console.log('Shader materials:', 
  Array.from(document.querySelectorAll('canvas'))
    .map(c => c.__r3f?.scene)
    .filter(Boolean)
);
```

---

## Next Steps

1. **Start dev server**: `pnpm run dev`
2. **Open console**: Press F12
3. **Navigate to main scene**
4. **Check logs**: Look for the patterns above
5. **Click logo marker**: Watch the console logs
6. **Report findings**: Share what you see in the console

The extensive logging will help us identify exactly where the issue is!

