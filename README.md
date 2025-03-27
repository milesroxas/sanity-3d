# 3D Headless CMS Experience

This is a test project to implement a 3D headless CMS experience using React Three Fiber, Next.js, Sanity, and Supabase.

## Built with

- [React Three Fiber](https://react-three-fiber.com/)
- [Next.js](https://nextjs.org/)
- [Sanity](https://www.sanity.io/)
- [Supabase](https://supabase.com/)
- [Schema UI](https://schemaui.com)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/)
- [React Three Drei](https://www.react-three-drei.com/)
- [Zustand](https://zustand.docs.pmnd.rs/)

## Camera System Documentation

The project implements a sophisticated camera system that handles various transitions and interactions in the 3D experience. Here's a detailed breakdown:

### Core Components

1. **Camera Store (`cameraStore.ts`)**
   - Manages camera state and transitions using Zustand
   - Handles position, target, and animation states
   - Controls different camera modes (Map, CameraControls, Disabled)
   - Manages transitions between scenes and POIs (Points of Interest)

2. **Main Scene Camera System (`MainSceneCameraSystem.tsx`)**
   - Implements the main scene camera with MapControls
   - Handles angle limits and distance constraints
   - Manages smooth camera transitions
   - Provides real-time camera position updates

3. **Camera System (`CameraSystem.tsx`)**
   - Controls camera behavior in scenes
   - Implements CameraControls for detailed model inspection
   - Handles transitions between different POIs
   - Manages camera constraints

### Camera Transitions

1. **Initial Load Animation**
   - Camera starts from an intro position
   - Smoothly transitions to the main scene position
   - Handles loading states and asset preparation
   - Coordinates with scene transitions

2. **Logo Marker Interactions**
   - When clicking a logo marker:
     1. Camera smoothly transitions to the marker's position
     2. UI elements fade out during transition
     3. Content transitions in
     4. Camera adjusts for optimal viewing

3. **POI Navigation**
   - Smooth transitions between different POIs
   - Handles camera constraints and limits
   - Coordinates with UI elements and carousel
   - Manages back navigation

### State Management

1. **Camera States**
   - `isAnimating`: Controls transition animations
   - `isLoading`: Manages loading states
   - `isSubscene`: Tracks current scene context
   - `controlType`: Switches between control modes

2. **Transition States**
   - Handles scene transitions
   - Manages UI element visibility
   - Coordinates with loading screens
   - Controls animation timing

### Technical Details

1. **Animation System**
   - Uses cubic easing for smooth transitions
   - Implements lerp (linear interpolation) for position and target
   - Handles cleanup of animation frames
   - Manages transition timing and coordination

2. **Camera Controls**
   - MapControls for main scene navigation
   - CameraControls for subscene inspection
   - Custom constraints and limits
   - Smooth damping and rotation speed

3. **Performance Optimizations**
   - Efficient state updates
   - Cleanup of animation frames
   - Proper handling of component unmounting
   - Memory leak prevention

### Usage Examples

```typescript
// Starting a camera transition
useCameraStore.getState().startCameraTransition(
  startPosition,
  endPosition,
  startTarget,
  endTarget
);

// Switching camera modes
useCameraStore.getState().setControlType("Map");

// Handling POI selection
useCameraStore.getState().setSelectedPoi(poi);
```

## Point of Interest System Documentation

The project implements a sophisticated Point of Interest (POI) system that enables interactive navigation between scenes and detailed content viewing. Here's a detailed breakdown:

### Core Components

1. **LogoMarkers (`LogoMarkers.tsx`)**
   - Renders interactive 3D markers in the main scene
   - Handles marker hover states and animations
   - Manages marker visibility and transitions
   - Coordinates with camera system for smooth transitions

2. **LogoMarkerContent (`LogoMarkerContent.tsx`)**
   - Displays detailed content for selected POIs
   - Manages content visibility and transitions
   - Handles back navigation and camera restoration
   - Coordinates with LogoMarkerStore for state management

3. **LogoMarkerStore (`logoMarkerStore.ts`)**
   - Manages POI state using Zustand
   - Handles scene selection and content visibility
   - Stores camera positions for transitions
   - Coordinates with Sanity CMS for content fetching

### Sanity CMS Integration

1. **Schema Definition**
   ```typescript
   defineField({
     name: "pointsOfInterest",
     type: "array",
     of: [
       {
         type: "reference",
         to: [{ type: "scenes" }],
       },
       {
         name: "pointOfInterest",
         type: "object",
         fields: [
           { name: "title", type: "string" },
           { name: "body", type: "block-content" },
           { name: "markerPosition", type: "object" },
           { name: "cameraPosition", type: "object" },
           { name: "cameraTarget", type: "object" }
         ]
       }
     ]
   })
   ```

2. **Data Structure**
   - Each POI contains:
     - Title and content
     - 3D marker position
     - Camera position and target for transitions
     - Reference to associated subscene

### Interaction Flow

1. **Main Scene Navigation**
   - User hovers over a logo marker
   - Marker animates and shows title
   - Click triggers camera transition
   - Content fades in after transition

2. **POI Navigation**
   - User enters POI through marker
   - Camera positions for optimal viewing
   - Additional POIs available for exploration
   - Smooth transitions between POIs

3. **Back Navigation**
   - User closes content view
   - Camera smoothly returns to previous position
   - Markers fade back in
   - Scene state restored

### Technical Implementation

1. **State Management**
   ```typescript
   interface LogoMarkerStore {
     selectedScene: Sanity.Scene | null;
     isContentVisible: boolean;
     isLoading: boolean;
     shouldAnimateBack: boolean;
     initialCameraPosition: Vector3 | null;
     initialCameraTarget: Vector3 | null;
     otherMarkersVisible: boolean;
   }
   ```

2. **Animation System**
   - Smooth transitions using cubic easing
   - Coordinated UI and camera animations
   - Cleanup of animation frames
   - Memory leak prevention

3. **Performance Optimizations**
   - Efficient state updates
   - Proper cleanup on unmount
   - Optimized marker rendering
   - Smooth transitions

### Usage Examples

```typescript
// Handling marker click
const handleMarkerClick = (poi: PointOfInterest) => {
  // Store current camera state
  setInitialCameraState(currentPosition, currentTarget);
  
  // Start transition
  setControlType("Disabled");
  setIsAnimating(true);
  
  // Animate to new position
  startCameraTransition(
    currentPosition,
    targetPosition,
    currentTarget,
    targetLookAt
  );
  
  // Load new scene
  fetchAndSetScene(poi.slug.current);
};

// Closing content view
const handleClose = () => {
  setContentVisible(false);
  setOtherMarkersVisible(true);
  setShouldAnimateBack(true);
};
```

## TODO: Core Features

- [x] Implement a 3D experience using React Three Fiber
- [x] Implement a headless CMS using Sanity
- [x] Implement a basic file upload system using Supabase
- [x] Scene navigation
- [x] Scene blocks from Schema UI
- [ ] Sanity CMS navigation settings
- [x] Create a camera animation system
- [x] Implement 3D animations
- [ ] Add animated vehicles
- [ ] Setup boundaries for map controls
- [ ] Setup limits for camera controls
- [ ] Add environment features
- [ ] Render billboard video texture 
- [ ] Implement baked textures
- [ ] Dynamic scene environment and lighting
- [ ] Implement loading screen
- [ ] Implement intro animations

## TODO: Chores

- [ ] Scene refinement
  - [x] Scene camera refinement for model positioning
  - [x] Scene layout design
  - [x] Scene carousel implementation
  - [x] Scene navigation refinement
  - [ ] Intro sequence animation (component mount animation)
- [ ] Review upstream updates from Schema UI
- [ ] Clean up queries and types
- [ ] Change /studio to /admin
- [ ] Add testing
- [ ] Separate Experience from Scenes as a singleton

## TODO: Brand

- [ ] Complete blocks reskin
- [ ] Add pages
- [ ] Refine landing page

## Revisions: 
The only notes are:



- The palm trees and some elements might be a bit too uniform and too many—consider breaking up the pattern.
- The event area with uniform tents could have more variation or detail.
- At least two moving vehicles should be black Kia Soul patrol cars, if possible.
- Field of View & Camera Adjustment:



- The Prospect Park field of view feels better—we should back up the camera slightly so that HOA & residential areas aren't cut off.
- The font and background for rear services should be larger to improve readability—they’re harder to see than the ones in the front.



Shield Icons & Logo Adjustments:



- Shield icons should be flat (not 3D) and without the clover—more understated is fine. We like the spin effect, and it should still look good with a less "heavy" icon.
- The upper left fixed logo isn’t necessary—let’s remove it.
- The small logo on the headquarters building might be redundant.
Instead: Place a larger sign on the center building (similar to the one on the left, but bigger).
- Remove the logo on the left building and the tiny one in the back.