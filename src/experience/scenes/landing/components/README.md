# Enhanced Billboard Component

## Overview

The Billboard component now features a modern, performant solution for seamless video texture to Mux player transitions. When users click the play button, the video texture is replaced with a fully functional Mux video player with controls and fullscreen capabilities.

## Features

### ✅ Dual Rendering Modes

- **Texture Mode**: Uses `useVideoTexture` for 3D mesh rendering (default state)
- **Player Mode**: Replaces texture with in-scene Mux player with controls
- **Fullscreen Mode**: Expands player to fullscreen with proper aspect ratio

### ✅ Performance Optimizations

- **Conditional Loading**: Mux player only loads when needed (dynamic import)
- **Resource Management**: Proper disposal of video textures when switching modes
- **Memoized Components**: `useCallback` for player components to prevent re-renders
- **Optimized State**: Minimal state updates with proper dependency arrays

### ✅ User Experience

- **Seamless Transitions**: Smooth mode switching without visual glitches
- **Responsive Design**: Maintains proper aspect ratios in all modes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Error Handling**: Graceful fallbacks for video loading issues

### ✅ Technical Implementation

- **Type Safety**: Full TypeScript support with proper interfaces
- **Modern React**: Uses hooks, memoization, and best practices
- **Three.js Integration**: Proper 3D scene integration with drei components
- **Portal Management**: Smart pointer event handling for modal interactions

## Usage

```tsx
<Billboard
  position={billboardPosition}
  scale={billboardScale}
  textureVideo={textureVideo}
  portalRef={portalRef}
/>
```

## API

### Props

| Prop       | Type            | Description                    |
| ---------- | --------------- | ------------------------------ |
| `position` | `THREE.Vector3` | 3D position of the billboard   |
| `scale`    | `number`        | Scale factor for the billboard |

| `textureVideo` | `Sanity.Video` | Video for texture and player |
| `portalRef` | `React.MutableRefObject<HTMLElement>` | Portal container reference |

### State Management

The component uses three distinct modes:

1. **`texture`**: Default mode showing video as 3D texture
2. **`player`**: In-scene Mux player with controls
3. **`fullscreen`**: Full-screen player mode

### Event Handlers

- **Play Button Click**: Transitions from texture to player mode
- **Fullscreen Button**: Transitions to fullscreen mode
- **Close Button**: Returns to previous mode or texture mode
- **Hover Events**: Shows/hides play button overlay

## Performance Considerations

### Memory Management

- Video textures are properly disposed when switching modes
- Mux player instances are reused efficiently
- Event listeners are cleaned up on unmount

### Loading Strategy

- Mux player is dynamically imported to reduce initial bundle size
- Loading states provide smooth user experience
- Fallback video URLs ensure content always loads

### Rendering Optimization

- Components are memoized to prevent unnecessary re-renders
- State updates are batched for better performance
- Portal interactions are optimized for minimal DOM manipulation

## Testing

The component includes comprehensive unit tests covering:

- Component rendering and exports
- TypeScript type safety
- State management and transitions
- Error handling scenarios

Run tests: `pnpm test src/experience/scenes/landing/components/__tests__/Billboard.test.tsx`

## Dependencies

- `@react-three/drei`: 3D components and hooks
- `@mux/mux-player-react`: Video player component
- `lucide-react`: Icon components
- `three`: 3D graphics library

## Best Practices Implemented

1. **No setTimeout Usage**: Avoided unless absolutely necessary
2. **Resource Cleanup**: Proper disposal of 3D resources
3. **Error Boundaries**: Graceful error handling
4. **Accessibility**: ARIA labels and keyboard support
5. **Performance**: Optimized rendering and state management
6. **Type Safety**: Full TypeScript coverage
7. **Testing**: Comprehensive test coverage

## Browser Compatibility

- Modern browsers with WebGL support
- Mobile devices with video playback capabilities
- Fullscreen API support for enhanced experience
