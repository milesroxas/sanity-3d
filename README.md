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
useCameraStore.getState().startCameraTransition(startPosition, endPosition, startTarget, endTarget);

// Switching camera modes
useCameraStore.getState().setControlType('Map');

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
     name: 'pointsOfInterest',
     type: 'array',
     of: [
       {
         type: 'reference',
         to: [{ type: 'scenes' }],
       },
       {
         name: 'pointOfInterest',
         type: 'object',
         fields: [
           { name: 'title', type: 'string' },
           { name: 'body', type: 'block-content' },
           { name: 'markerPosition', type: 'object' },
           { name: 'cameraPosition', type: 'object' },
           { name: 'cameraTarget', type: 'object' },
         ],
       },
     ],
   });
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
  setControlType('Disabled');
  setIsAnimating(true);

  // Animate to new position
  startCameraTransition(currentPosition, targetPosition, currentTarget, targetLookAt);

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

## Marker System Documentation

The project implements a sophisticated marker system that handles interactive 3D markers with hover states, animations, and transitions. Here's a detailed breakdown:

### Core Components

1. **LogoMarker (`LogoMarker.tsx`)**

   - Renders the 3D marker model
   - Handles opacity and transform animations using GSAP
   - Manages hover state animations (rotation, scale, position)
   - Coordinates with parent components for state changes

2. **PoiMarker (`PoiMarker.tsx`)**

   - Wrapper component for individual markers
   - Manages hitbox and interaction states
   - Handles HTML label rendering and styling
   - Coordinates hover effects with LogoMarker

3. **LogoMarkers (`LogoMarkers.tsx`)**
   - Parent component managing all markers
   - Handles marker visibility and transitions
   - Coordinates with camera system for transitions
   - Manages global hover state through store

### State Management

1. **LogoMarkerStore**

   ```typescript
   interface LogoMarkerStore {
     // State
     selectedScene: Sanity.Scene | null;
     isContentVisible: boolean;
     isLoading: boolean;
     shouldAnimateBack: boolean;
     initialCameraPosition: Vector3 | null;
     initialCameraTarget: Vector3 | null;
     otherMarkersVisible: boolean;
     hoveredMarkerId: string | null; // Centralized hover state

     // Actions
     setSelectedScene: (scene: Sanity.Scene | null) => void;
     setContentVisible: (visible: boolean) => void;
     setIsLoading: (loading: boolean) => void;
     setShouldAnimateBack: (should: boolean) => void;
     setInitialCameraState: (position: Vector3, target: Vector3) => void;
     setOtherMarkersVisible: (visible: boolean) => void;
     setHoveredMarkerId: (id: string | null) => void;
     fetchAndSetScene: (slug: string) => Promise<void>;
     reset: () => void;
   }
   ```

2. **Hover State Management**
   - Centralized in LogoMarkerStore
   - Reset automatically when markers visibility changes
   - Coordinated with marker animations
   - Handles cleanup on unmount

### Animation System

1. **GSAP Timeline**

   ```typescript
   const tl = gsap.timeline({
     defaults: { duration: 0.6, ease: 'power2.inOut' },
   });

   // Handle opacity changes
   tl.to(opacityRef, {
     current: opacity,
     duration: 0.6,
     onUpdate: () => {
       // Update material properties
     },
   });

   // Handle transform animations
   if (isFadingIn) {
     tl.to(groupRef.current.rotation, {
       y: 0,
       duration: 0.6,
     })
       .to(
         groupRef.current.position,
         {
           y: 0,
           duration: 0.6,
         },
         '<'
       )
       .to(
         groupRef.current.scale,
         {
           x: baseScale,
           y: baseScale,
           z: baseScale,
           duration: 0.6,
         },
         '<'
       );
   }
   ```

2. **Hover Animations**
   - Rotation: Full 360-degree spin
   - Position: Slight upward movement
   - Scale: 20% increase
   - Light intensity: 100% increase
   - HTML label: Scale and color changes

### Interaction Flow

1. **Marker Visibility**

   - Markers fade in/out based on `otherMarkersVisible`
   - Hover state reset when visibility changes
   - Hitbox enabled/disabled with visibility
   - Smooth transitions between states

2. **Hover Interactions**

   - User hovers over marker
   - Hitbox triggers hover state
   - GSAP animates marker transforms
   - HTML label updates styling
   - Light intensity increases

3. **Click Interactions**
   - User clicks marker
   - Markers fade out
   - Camera transitions to new position
   - Content fades in
   - State updates in store

### Technical Implementation

1. **Performance Optimizations**

   - Direct DOM manipulation for HTML labels
   - Efficient GSAP timeline management
   - Proper cleanup of animations
   - Memory leak prevention

2. **Event Handling**

   ```typescript
   const handlePointerEnter = () => {
     if (otherMarkersVisible) {
       setHoveredMarkerId(poi._id);
     }
   };

   const handlePointerLeave = () => {
     setHoveredMarkerId(null);
   };

   const handleClick = () => {
     if (otherMarkersVisible) {
       handleMarkerClick(poi);
     }
   };
   ```

3. **Cleanup**
   ```typescript
   useEffect(() => {
     return () => {
       if (groupRef.current) {
         groupRef.current.rotation.y = 0;
         groupRef.current.position.y = 0;
         const baseScale = typeof scale === 'number' ? scale : scale[0];
         groupRef.current.scale.set(baseScale, baseScale, baseScale);
       }
     };
   }, [scale]);
   ```

### Usage Examples

```typescript
// Creating a marker
<LogoMarker
  isHovered={isHovered}
  position={[0, 0, 0]}
  scale={0.5}
  opacity={opacity}
/>

// Handling marker visibility
useEffect(() => {
  setHoveredMarkerId(null);
}, [otherMarkersVisible, setHoveredMarkerId]);

// Managing marker transitions
const handleMarkerClick = (poi: any) => {
  setOtherMarkersVisible(false);
  // ... camera transition logic
};
```

## TODO: Core Features

- [ ] Sanity CMS navigation settings
- [ ] Implement baked textures

## TODO: Chores

- [ ] Change /studio to /admin

## TODO: Brand

- [ ] Complete blocks reskin
- [ ] Add pages
- [ ] Refine landing page

## Revisions:

The only notes are:

- [ ] The palm trees and some elements might be a bit too uniform and too many—consider breaking up the pattern.
- [x] The event area with uniform tents could have more variation or detail.
- [ ] At least two moving vehicles should be black Kia Soul patrol cars, if possible.
- [x] Field of View & Camera Adjustment:

- [ ] The Prospect Park field of view feels better—we should back up the camera slightly so that HOA & residential areas aren't cut off.
- [ ] The font and background for rear services should be larger to improve readability—they're harder to see than the ones in the front.

Shield Icons & Logo Adjustments:

- [x] Shield icons should be flat (not 3D) and without the clover—more understated is fine. We like the spin effect, and it should still look good with a less "heavy" icon.
- [x] The upper left fixed logo isn't necessary—let's remove it.
- [x] The small logo on the headquarters building might be redundant.
- [x] Instead: Place a larger sign on the center building (similar to the one on the left, but bigger).
- [x] Remove the logo on the left building and the tiny one in the back.

Most critical

- [x] think the windmills in the palm trees in the bottom left of the scene can be removed.

- [x] I think the logo on the building still probably needs to be larger somehow.

- [ ] I think the initial view is too high and too close probably more at the level of prospect park.

- [x] the tabs for the content when you click on a service should slide in at take up about 1/3rd maybe a little more of the screen top to bottom so it can operate like a mini scrollable webpage. The view for this section should make sure whatever service you clicked on has that scene in an optimal spot opposite the information block so you can see it clearly.

- [x] patrol car roaming around the city

- [ ] ability to pan camera full motion like 360 etc

A little more picky and probably more difficult and could potentially be don’t after we get everything locked in and working and the intro page done and the interior (standard website done) I think that will just be a single page site with pop up read more for extra text based content….

- If when you click on HOA and it pans over and the tab slides in that can trigger the patrol car so come from behind the tab area and drive to the gate with its free lights in that would be cool.

- I think retail might be too bunched up with HOA and Construction and events

-[x] What if that big office like building was a retail mall style building with parking lot or some shops with it. So retail moves there

-[x] what if events moved to the farm and it was a concert stage instead maybe a Ferris wheel? We are known for Coachella fest.

- This would leave that spot just to the right of retail that is now a little condo community not sure what we could put there that makes sense for this but we could add Live Camera Monitoring as a service and somehow depict an areas that would need outdoor cameras maybe 1 tower camera and some fixed ones on a post or wall.
