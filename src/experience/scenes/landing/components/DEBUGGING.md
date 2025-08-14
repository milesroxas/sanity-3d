# Billboard Component Debugging Guide

## Issue Resolution

The main issue causing the scene to freeze was in the `useVideoTexture` hook implementation. The original code was:

```tsx
// PROBLEMATIC CODE
const texture = useVideoTexture(mode === 'texture' ? videoUrl : null, {
  muted: true,
  loop: true,
  start: mode === 'texture',
});
```

This caused the hook to recreate/dispose the texture when switching modes, leading to R3F scene freezing.

## Solution Applied

### 1. Stable Video Texture Creation

```tsx
// FIXED CODE
const texture = useVideoTexture(videoUrl, {
  muted: true,
  loop: true,
  start: true, // Always start, control visibility via material
});
```

### 2. Material-Based Visibility Control

```tsx
const billboardMaterial = useMemo(() => {
  const material = new THREE.MeshStandardMaterial({
    map: mode === 'texture' ? texture : null, // Only show texture in texture mode
    color: mode === 'texture' ? '#ffffff' : '#000000',
    toneMapped: false,
  });
  return material;
}, [texture, mode]);
```

### 3. Safe Video Playback Management

```tsx
// Control video playback based on mode
if (mode === 'texture') {
  // Play video
} else {
  // Pause video
}
```

## Debug Console Logs Added

The component now includes comprehensive logging:

- `"Billboard clicked, current mode: [mode]"`
- `"Switching to player mode"`
- `"Billboard mode changed to: [mode]"`
- `"Portal container not found"` (if portal issues)
- `"Setting portal pointer events for mode: [mode]"`
- `"No playbackId available for Mux player"`

## Testing Steps

1. **Open Browser Console** - Watch for debug messages
2. **Click Billboard** - Should see:

   ```
   Billboard clicked, current mode: texture
   Switching to player mode
   Billboard mode changed to: player
   Setting portal pointer events for mode: player
   Portal pointer events set to auto
   ```

3. **Expected Behavior**:
   - Scene should NOT freeze
   - Billboard texture should disappear (turn black)
   - Mux player should appear in 3D space
   - Player controls should be functional

## Common Issues & Solutions

### Scene Still Freezes

- Check console for texture-related errors
- Verify video URL is valid
- Ensure `useVideoTexture` isn't recreating texture

### Player Not Appearing

- Check for "No playbackId available" message
- Verify `textureVideo.asset.playbackId` exists
- Check portal container setup

### Click Not Registering

- Verify mesh has `onClick={handlePlayClick}`
- Check if other elements are intercepting clicks
- Ensure `visible={mode === 'texture'}` is working

### Portal Issues

- Check for "Portal container not found" message
- Verify `modal-portal` element exists in DOM
- Check R3F Provider setup

## Code Structure

### State Management

- `mode`: Controls billboard state ('texture' | 'player' | 'fullscreen')
- `hovered`: Shows/hides play button
- `playerState`: Tracks video playback state

### Key Components

- `InScenePlayer`: Mux player in 3D space
- `FullscreenPlayer`: Portal-based fullscreen player
- `billboardMaterial`: Controls texture visibility

### Event Handlers

- `handlePlayClick`: texture → player
- `handleFullscreenToggle`: player ↔ fullscreen
- `handleClosePlayer`: → texture

## Performance Optimizations

1. **Stable Video URL**: Memoized to prevent recreations
2. **Conditional Portal**: Only rendered when needed
3. **Memoized Components**: `useCallback` for player components
4. **Material Efficiency**: Single material instance per mode

## Rollback Plan

If issues persist, you can revert to the simple modal approach by:

1. Removing the mode-based rendering
2. Using the original `VideoModal` component
3. Keeping only the `showModal` state

```tsx
// Fallback approach
const [showModal, setShowModal] = useState(false);
onClick={() => setShowModal(true)}
```

This guide should help you identify and resolve any remaining issues with the billboard component.
