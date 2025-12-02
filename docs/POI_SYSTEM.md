# Points of Interest (POI) System

## Overview

The POI system provides an interactive way to display content overlays for specific 3D positions in your scene. It supports both **legacy mode** (auto-show) and **interactive mode** (click-to-view).

## Features

- ✅ **Backwards Compatible**: Existing content continues working unchanged
- ✅ **Camera-Aware Animations**: POI buttons appear only after camera transitions complete
- ✅ **Rich Content Support**: Same blocks/content options as marker content
- ✅ **No Race Conditions**: Clean state management with Zustand stores
- ✅ **Responsive**: Mobile and desktop layouts
- ✅ **Type Safe**: Full TypeScript support

## Architecture

### State Management

**Three separate stores** (no circular dependencies):

1. **`logoMarkerStore`** - Owns scene selection and camera state
2. **`poiStore`** - Owns POI-specific state (visibility, selection)
3. **`expandedContentStore`** - Reusable for both marker and POI overlays

**State Flow** (prevents race conditions):
```
Camera Animation Completes
  ↓
PoiManager detects (via isAnimating === false)
  ↓
Sets poisVisible = true
  ↓
PoiButton components animate in
  ↓
User clicks POI
  ↓
setSelectedPoi(poi)
  ↓
PoiContentOverlay displays
```

### Component Structure

```
MainScene
  └── LogoMarkers (orchestrator)
      ├── PoiMarker[] (logo markers - always shown)
      └── PoiManager (if interactive mode)
          └── PoiButton[] (POI buttons)

LogoMarkerContent (UI overlay)
  ├── MarkerContentOverlay (for expanded content)
  └── PoiContentOverlay (for POI content)
```

## Usage

### 1. Enable Interactive Mode in Sanity

In your Scene document:

1. Go to **Settings** tab
2. Set **Points of Interest Display Mode** to:
   - **Legacy** (default) - Auto-show logo markers (current behavior)
   - **Interactive Buttons** - Show clickable POI buttons after camera transition

### 2. Add POI to Your Scene

In **Content** tab → **Points of Interest**:

1. Add **Point of Interest** (not Scene reference)
2. Fill in required fields:
   - **Title** (required) - Displayed on button
   - **Marker Position** (required) - 3D position `{x, y, z}`
3. Add optional content:
   - **Blocks** (recommended) - Rich content with media, carousels, etc.
   - **Body** (legacy) - Simple portable text
   - **Links** - Action buttons
4. Optional camera control:
   - **Camera Position** - Where camera moves when POI clicked
   - **Camera Target** - Where camera looks

### 3. Content Options

POIs support the same rich content as marker content:

- **Text Blocks** - Formatted text with portable text
- **Experience Carousel** - Image/video carousels
- **Media** - Images and videos
- **Links** - Call-to-action buttons

## Example Configuration

### Simple POI (No Camera Movement)

```javascript
{
  _type: 'pointOfInterest',
  title: 'Security Office',
  markerPosition: { x: 50, y: 10, z: 30 },
  blocks: [
    {
      _type: 'text-block',
      // ... text content
    }
  ],
  links: [
    {
      _type: 'customLink',
      title: 'Contact Security',
      href: '/contact'
    }
  ]
}
```

### Advanced POI (With Camera Movement)

```javascript
{
  _type: 'pointOfInterest',
  title: 'Main Entrance',
  markerPosition: { x: 100, y: 15, z: 50 },
  cameraPosition: { x: 120, y: 20, z: 60 },
  cameraTarget: { x: 100, y: 10, z: 50 },
  blocks: [
    {
      _type: 'experience-carousel',
      // ... carousel with entrance photos
    }
  ]
}
```

## Migration Guide

### From Legacy to Interactive Mode

**No breaking changes required!** You can switch modes anytime:

1. Existing POIs will work in interactive mode (if they have `markerPosition`)
2. Add `blocks` field to POIs for richer content
3. Test in preview before publishing
4. Switch back to legacy mode anytime if needed

### Adding Rich Content to Existing POIs

```javascript
// Before (legacy)
{
  title: 'My POI',
  body: [ /* portable text */ ],
  markerPosition: { x: 10, y: 5, z: 20 }
}

// After (enhanced - backwards compatible)
{
  title: 'My POI',
  body: [ /* portable text - still works */ ],
  blocks: [ /* rich content - preferred */ ],
  links: [ /* action buttons */ ],
  markerPosition: { x: 10, y: 5, z: 20 }
}
```

## Technical Details

### Race Condition Prevention

**Problem**: Camera animation, POI visibility, and overlay rendering could conflict.

**Solution**: Clear dependency chain with atomic state updates:

```typescript
// PoiManager.tsx
useEffect(() => {
  if (!isAnimating && isContentVisible && inlinePois.length > 0) {
    // Delay slightly to ensure camera has fully settled
    const timer = setTimeout(() => {
      setPoisVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  } else {
    setPoisVisible(false);
  }
}, [isAnimating, isContentVisible, inlinePois.length, setPoisVisible]);
```

### Store Isolation

**No circular dependencies**:
- `poiStore` never imports `logoMarkerStore`
- `logoMarkerStore` never imports `poiStore`
- Both can be reset independently
- `expandedContentStore` is reusable for both

### Type Safety

Full TypeScript support with discriminated unions:

```typescript
type PointOfInterest = {
  _type: 'pointOfInterest';
  title: string;
  blocks?: Block[];
  markerPosition: { x: number; y: number; z: number };
  // ...
};

type SceneReference = {
  _type: 'scenes';
  // ...
};

// Type guards ensure correct filtering
const inlinePois = pointsOfInterest.filter(
  (poi): poi is PointOfInterest =>
    poi._type === 'pointOfInterest' && !!poi.markerPosition
);
```

## Files Created/Modified

### New Files
- `/src/experience/scenes/store/poiStore.ts` - POI state management
- `/src/experience/scenes/mainScene/components/PoiButton.tsx` - 3D POI button
- `/src/experience/scenes/mainScene/components/PoiManager.tsx` - POI orchestration
- `/src/experience/scenes/mainScene/components/PoiContentOverlay.tsx` - POI overlay UI

### Modified Files
- `/src/sanity/schemas/documents/scenes.ts` - Added `poiDisplayMode` and enhanced POI schema
- `/src/types/Sanity.d.ts` - Added `PointOfInterest` and `SceneReference` types
- `/src/experience/scenes/mainScene/components/LogoMarkerContent.tsx` - POI overlay integration
- `/src/experience/scenes/mainScene/components/LogoMarkers.tsx` - Conditional POI rendering

## Best Practices

1. **Use Blocks over Body**: Blocks provide richer content options
2. **Test Both Modes**: Verify legacy mode still works before switching
3. **Gradual Migration**: Enable interactive mode scene-by-scene
4. **Position Carefully**: POI buttons should be visually clear in 3D space
5. **Limit POIs**: Too many buttons can clutter the scene (recommend 3-5 max)

## Troubleshooting

### POI Buttons Don't Appear

**Check:**
- Scene `poiDisplayMode` is set to `'interactive'`
- POI has valid `markerPosition`
- Camera animation has completed
- POI is of type `'pointOfInterest'` (not scene reference)

### Content Not Showing

**Check:**
- POI has either `blocks` or `body` field populated
- No console errors
- `PoiContentOverlay` is rendering (check React DevTools)

### Race Conditions

If you see flickering or timing issues:
- Check `isAnimating` state in camera store
- Verify 300ms delay in `PoiManager`
- Ensure no conflicting animations

## Future Enhancements

Potential additions (not implemented):
- POI grouping/categories
- Animated paths between POIs
- POI search/filter
- Analytics tracking
- A/B testing support
