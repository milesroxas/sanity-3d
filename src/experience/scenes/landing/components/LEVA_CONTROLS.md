# Billboard Player Leva Controls

## Overview

The Billboard component now includes Leva debug controls for real-time adjustment of the Mux player positioning and appearance. These controls follow the established debug patterns in your codebase.

## How to Enable

1. **Enable Debug Mode**: Open Leva panel and enable "Debug Controls" → "enabled"
2. **Access Player Settings**: Look for "Player Settings" panel in Leva
3. **Adjust Values**: Use the controls to fine-tune positioning in real-time

## Control Sections

### 📍 Position

Fine-tune the 3D position of the Mux player:

- **Position X** (-50 to 50, step 0.1)
  - Move player left/right
  - Default: `12.201`

- **Position Y** (-50 to 50, step 0.1)
  - Move player up/down
  - Default: `23.171`

- **Position Z** (-50 to 50, step 0.1)
  - Move player forward/backward
  - Default: `-9.768` (slightly in front of billboard)

### 🔄 Rotation

Control the orientation of the player:

- **Rotation X (Pitch)** (-π to π, step 0.01)
  - Tilt player up/down
  - Default: `0`

- **Rotation Y (Yaw)** (-π to π, step 0.01)
  - Rotate player left/right
  - Default: `0.1` (matches billboard angle)

- **Rotation Z (Roll)** (-π to π, step 0.01)
  - Roll player clockwise/counterclockwise
  - Default: `0`

### 📏 Scaling

Adjust size and distance behavior:

- **Scale** (0.1 to 2, step 0.05)
  - Overall size of the player
  - Default: `0.8`

- **Distance Factor** (1 to 20, step 0.5)
  - How much player scales with camera distance
  - Higher = more scaling, Lower = less scaling
  - Default: `10`

### 📐 Dimensions

Control player size in pixels:

- **Width** (200px to 1200px, step 50px)
  - Player width
  - Default: `800px`

- **Height** (100px to 800px, step 25px)
  - Player height
  - Default: `450px` (maintains 16:9 aspect ratio)

## Usage Workflow

### Initial Setup

1. Enable debug mode in Leva
2. Click billboard to activate player mode
3. Open "Player Settings" folder in Leva
4. Start with small adjustments

### Common Adjustments

#### **Player Too Far/Close**

- Adjust **Position Z**
- Positive = further from camera
- Negative = closer to camera

#### **Player Off-Center**

- Adjust **Position X** (left/right)
- Adjust **Position Y** (up/down)

#### **Player Wrong Angle**

- Adjust **Rotation Y** to match billboard
- Keep X and Z rotations at 0 for upright player

#### **Player Wrong Size**

- Adjust **Scale** for overall size
- Adjust **Width/Height** for aspect ratio
- Consider **Distance Factor** for camera scaling

### Fine-Tuning Tips

1. **Start with Position**: Get the basic location right first
2. **Match Rotation**: Align with billboard surface angle
3. **Size Appropriately**: Scale to fit naturally on billboard
4. **Test Camera Movement**: Ensure distance factor works well

## Debug Patterns

This implementation follows your codebase patterns:

### ✅ **Conditional Debug Controls**

```tsx
const { enabled: debugEnabled } = useDebugControls();
```

### ✅ **Organized Control Groups**

```tsx
useControls('Player Settings', {
  position: folder({ ... }),
  rotation: folder({ ... }),
  scaling: folder({ ... }),
  dimensions: folder({ ... })
})
```

### ✅ **Default Config Fallback**

```tsx
const playerConfig = useMemo(() => {
  if (debugEnabled) {
    return {
      /* Leva values */
    };
  }
  return {
    /* Default values */
  };
}, [debugEnabled, playerControls, defaultPlayerConfig]);
```

### ✅ **Collapsed by Default**

```tsx
{
  collapsed: true;
}
```

## Integration with Existing Debug System

- **Shares Debug Toggle**: Uses same `useDebugControls()` as other components
- **Follows Naming Convention**: Matches `useCameraControls`, `useBillboardControls`, etc.
- **Proper Organization**: Located in `config/controls/` with other controls
- **Exported Consistently**: Added to controls index file

## Performance Notes

- Controls only active when debug mode is enabled
- No performance impact in production
- Values memoized to prevent unnecessary re-renders
- Falls back to optimized defaults when debug is disabled

## Copy Final Values

Once you find the perfect positioning:

1. Note the values from Leva panel
2. Update `defaultPlayerConfig` in Billboard.tsx:

```tsx
const defaultPlayerConfig = useMemo(
  () => ({
    position: { x: 12.201, y: 23.171, z: -9.868 + 0.1 },
    rotation: { x: 0, y: 0.1, z: 0 },
    scale: 0.8,
    distanceFactor: 10,
    dimensions: { width: 800, height: 450 },
  }),
  []
);
```

3. Disable debug mode for production use

This ensures your final values are locked in while maintaining debug capability for future adjustments.
