'use client';

import { Button } from '@/components/ui/button';
import {
  Billboard as DreiBillboard,
  Html,
  PerspectiveCamera,
  useProgress,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import { AnimatedClouds } from '@/experience/effects/components/Clouds';
import { VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { INITIAL_POSITIONS, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three';
import { Billboard } from './components/Billboard';
import { Effects } from './components/Effects';
import { SceneEnvironment } from './components/SceneEnvironment';
import { Vehicles } from './components/Vehicles';
import { DesertModels } from './compositions/DesertModels';

import { Ground } from './compositions/Ground';
import {
  useBillboardControls,
  useCameraControls,
  useDebugControls,
  useMainContentControls,
  useSceneInfoControls,
} from './config/controls';
import { MOUSE_CONFIG } from './config/mouseConfig';
import { useResponsiveConfig, useResponsiveTextStyles } from './hooks/useResponsiveConfig';
import { useLandingCameraStore } from './store/landingCameraStore';

interface LandingSceneProps {
  textureVideo: Sanity.Video | undefined;
  modalVideo: Sanity.Video | undefined;
}

const LandingScene = memo(({ textureVideo, modalVideo }: LandingSceneProps) => {
  const router = useRouter();
  const { size } = useThree();
  const { contextSafe } = useGSAP();

  // Store state
  const {
    isAnimating,
    setAnimating,
    hasAnimated,
    setHasAnimated,
    isVideoPlaying,
    mouseTrackingEnabled,
  } = useLandingCameraStore();
  const setCameraReady = useLandingCameraStore(state => state.setCameraReady);

  // Refs
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const animationStartedRef = useRef(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  const isHoveringUI = useRef(false);
  const lastValidMousePosition = useRef({ x: 0, y: 0 });
  const isPageVisible = useRef(true);

  // Progress tracking
  const { progress, active } = useProgress();
  const isLoaded = !active || progress >= 99.5;

  // Responsive configuration
  const responsiveConfig = useResponsiveConfig();
  const textStyles = useResponsiveTextStyles();

  // Debug controls
  const { enabled: debugEnabled } = useDebugControls();
  useSceneInfoControls(size.width, size.height, hasAnimated && !isAnimating);

  // Camera controls
  const {
    positionX: cameraPositionX,
    positionY: cameraPositionY,
    positionZ: cameraPositionZ,
    targetX: cameraTargetX,
    targetY: cameraTargetY,
    targetZ: cameraTargetZ,
    mouseInfluence,
    mouseDamping,
  } = useCameraControls(
    responsiveConfig.camera.position,
    responsiveConfig.camera.target,
    MOUSE_CONFIG.influence,
    MOUSE_CONFIG.dampingFactor
  );

  // Main content controls
  const {
    positionX: mainContentPositionX,
    positionY: mainContentPositionY,
    positionZ: mainContentPositionZ,
  } = useMainContentControls(responsiveConfig.mainContent.position);

  // Billboard controls
  const {
    positionX: billboardPositionX,
    positionY: billboardPositionY,
    positionZ: billboardPositionZ,
    scale: billboardScale,
  } = useBillboardControls(responsiveConfig.billboard.position, responsiveConfig.billboard.scale);

  // Stable configuration - only update when debug mode changes or responsive config changes
  const currentConfig = useMemo(() => {
    if (debugEnabled) {
      return {
        camera: {
          position: { x: cameraPositionX, y: cameraPositionY, z: cameraPositionZ },
          target: { x: cameraTargetX, y: cameraTargetY, z: cameraTargetZ },
        },
        mainContent: {
          position: { x: mainContentPositionX, y: mainContentPositionY, z: mainContentPositionZ },
        },
        billboard: {
          position: { x: billboardPositionX, y: billboardPositionY, z: billboardPositionZ },
          scale: billboardScale,
        },
        mouseInfluence,
        mouseDamping,
      };
    }
    return {
      ...responsiveConfig,
      mouseInfluence: MOUSE_CONFIG.influence,
      mouseDamping: MOUSE_CONFIG.dampingFactor,
    };
  }, [
    debugEnabled,
    responsiveConfig,
    // Only include debug controls when debug is enabled
    ...(debugEnabled
      ? [
          cameraPositionX,
          cameraPositionY,
          cameraPositionZ,
          cameraTargetX,
          cameraTargetY,
          cameraTargetZ,
          mainContentPositionX,
          mainContentPositionY,
          mainContentPositionZ,
          billboardPositionX,
          billboardPositionY,
          billboardPositionZ,
          billboardScale,
          mouseInfluence,
          mouseDamping,
        ]
      : []),
  ]);

  // Stable position objects - prevent recreation on every frame
  const positions = useMemo(() => {
    const cameraPos = new Vector3(
      currentConfig.camera.position.x,
      currentConfig.camera.position.y,
      currentConfig.camera.position.z
    );
    const targetPos = new Vector3(
      currentConfig.camera.target.x,
      currentConfig.camera.target.y,
      currentConfig.camera.target.z
    );
    const mainContentPos = new Vector3(
      currentConfig.mainContent.position.x,
      currentConfig.mainContent.position.y,
      currentConfig.mainContent.position.z
    );
    const billboardPos = new Vector3(
      currentConfig.billboard.position.x,
      currentConfig.billboard.position.y,
      currentConfig.billboard.position.z
    );

    // Start positions for initial camera placement
    const startConfig = 'start' in currentConfig.camera ? currentConfig.camera.start : null;
    const initialCameraPos = startConfig
      ? new Vector3(startConfig.position.x, startConfig.position.y, startConfig.position.z)
      : cameraPos;

    return {
      camera: cameraPos,
      target: targetPos,
      initialCamera: initialCameraPos,
      mainContent: mainContentPos,
      billboard: {
        position: billboardPos,
        scale: currentConfig.billboard.scale,
      },
    };
  }, [currentConfig]);

  // Mouse event handlers
  const handleMouseEnterUI = useCallback(() => {
    isHoveringUI.current = true;
  }, []);

  const handleMouseLeaveUI = useCallback(() => {
    isHoveringUI.current = false;
  }, []);

  // Clean up GSAP timeline function
  const cleanupTimeline = useCallback(() => {
    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
      entranceTimelineRef.current = null;
    }
  }, []);

  // Ensure camera has a sensible initial lookAt before animations
  useLayoutEffect(() => {
    // Don't reset camera position during animation
    if (cameraRef.current && !isAnimating && !animationStartedRef.current) {
      // Use start position if defined, otherwise use end position
      const startConfig = 'start' in currentConfig.camera ? currentConfig.camera.start : null;

      if (startConfig) {
        cameraRef.current.position.set(
          startConfig.position.x,
          startConfig.position.y,
          startConfig.position.z
        );
        cameraRef.current.lookAt(startConfig.target.x, startConfig.target.y, startConfig.target.z);
      } else {
        cameraRef.current.position.copy(positions.camera);
        cameraRef.current.lookAt(positions.target);
      }
    }
    // We only depend on the numeric values to avoid stale refs while staying stable
  }, [
    positions.camera.x,
    positions.camera.y,
    positions.camera.z,
    positions.target.x,
    positions.target.y,
    positions.target.z,
    isAnimating,
    currentConfig.camera,
  ]);

  // Mark camera ready once seeded to prevent viewport seeding from using provider camera
  useEffect(() => {
    setCameraReady(true);
    return () => setCameraReady(false);
  }, [setCameraReady]);

  // Entrance animation
  const handleEnter = contextSafe(() => {
    if (!cameraRef.current || animationStartedRef.current || isAnimating) return;

    animationStartedRef.current = true;
    setAnimating(true);
    cleanupTimeline();

    const tl = gsap.timeline({
      onComplete: () => {
        setHasAnimated(true);
        setAnimating(false);
        entranceTimelineRef.current = null;
      },
    });

    entranceTimelineRef.current = tl;

    // Capture final positions at start to prevent race conditions
    const finalCameraPos = { x: positions.camera.x, y: positions.camera.y, z: positions.camera.z };
    const finalTargetPos = { x: positions.target.x, y: positions.target.y, z: positions.target.z };

    // Set initial camera position - use explicit start config or fallback to offset
    const startConfig = 'start' in currentConfig.camera ? currentConfig.camera.start : null;

    if (startConfig) {
      cameraRef.current.position.set(
        startConfig.position.x,
        startConfig.position.y,
        startConfig.position.z
      );
    } else {
      // Fallback to offset-based start position
      const startPosition = positions.camera.clone();
      startPosition.z += 300;
      startPosition.y += 50;
      startPosition.x += 10;
      cameraRef.current.position.copy(startPosition);
    }

    // Camera animation with optional keyframes
    const keyframes =
      'keyframes' in currentConfig.camera ? currentConfig.camera.keyframes : undefined;

    if (keyframes && keyframes.length > 0) {
      // Create animated target proxy that GSAP will animate
      // Use start target if defined, otherwise use end target
      const targetProxy = startConfig
        ? {
            x: startConfig.target.x,
            y: startConfig.target.y,
            z: startConfig.target.z,
          }
        : {
            x: positions.target.x,
            y: positions.target.y,
            z: positions.target.z,
          };
      const targetVector = new Vector3();
      const camera = cameraRef.current; // Cache ref for forEach

      let cumulativeDuration = 0;

      // Animate through each keyframe
      keyframes.forEach(keyframe => {
        const ease = keyframe.ease || 'power2.out';

        // Animate position to this keyframe
        tl.to(
          camera.position,
          {
            x: keyframe.position.x,
            y: keyframe.position.y,
            z: keyframe.position.z,
            duration: keyframe.duration,
            ease,
            onUpdate: () => {
              targetVector.set(targetProxy.x, targetProxy.y, targetProxy.z);
              camera.lookAt(targetVector);
            },
          },
          cumulativeDuration
        );

        // Animate target to this keyframe alongside position
        tl.to(
          targetProxy,
          {
            x: keyframe.target.x,
            y: keyframe.target.y,
            z: keyframe.target.z,
            duration: keyframe.duration,
            ease,
          },
          cumulativeDuration
        );

        cumulativeDuration += keyframe.duration;
      });

      // Calculate remaining duration for final animation
      const totalKeyframeDuration = keyframes.reduce((sum, kf) => sum + kf.duration, 0);
      const remainingDuration = Math.max(0.5, 4.5 - totalKeyframeDuration); // Minimum 0.5s for final

      // Animate to final position
      tl.to(
        cameraRef.current.position,
        {
          x: finalCameraPos.x,
          y: finalCameraPos.y,
          z: finalCameraPos.z,
          duration: remainingDuration,
          ease: 'power2.out',
          onUpdate: () => {
            targetVector.set(targetProxy.x, targetProxy.y, targetProxy.z);
            cameraRef.current?.lookAt(targetVector);
          },
        },
        cumulativeDuration
      );

      // Animate target to final alongside position
      tl.to(
        targetProxy,
        {
          x: finalTargetPos.x,
          y: finalTargetPos.y,
          z: finalTargetPos.z,
          duration: remainingDuration,
          ease: 'power2.out',
        },
        cumulativeDuration
      );
    } else {
      // Original single animation with animated target
      // Use start target if defined, otherwise use end target
      const targetProxy = startConfig
        ? {
            x: startConfig.target.x,
            y: startConfig.target.y,
            z: startConfig.target.z,
          }
        : {
            x: positions.target.x,
            y: positions.target.y,
            z: positions.target.z,
          };
      const targetVector = new Vector3();

      // Animate position
      tl.to(
        cameraRef.current.position,
        {
          x: finalCameraPos.x,
          y: finalCameraPos.y,
          z: finalCameraPos.z,
          duration: 4.5,
          ease: 'power2.out',
          onUpdate: () => {
            targetVector.set(targetProxy.x, targetProxy.y, targetProxy.z);
            cameraRef.current?.lookAt(targetVector);
          },
        },
        0
      );

      // Animate target
      tl.to(
        targetProxy,
        {
          x: finalTargetPos.x,
          y: finalTargetPos.y,
          z: finalTargetPos.z,
          duration: 4.5,
          ease: 'power2.out',
        },
        0
      );
    }

    // Content animation - simplified and more reliable
    if (contentRef.current) {
      // Set initial state
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 20,
        visibility: 'visible', // Ensure visibility is set
      });

      // Animate in
      tl.to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out',
        },
        '-=1' // Start 1 second before camera animation ends
      );
    }

    // Portal interactivity handled centrally in wrapper
  });

  // Exit animation
  const handleExit = contextSafe(() => {
    if (isAnimating) return;

    setAnimating(true);
    cleanupTimeline();

    const tl = gsap.timeline({
      onComplete: () => {
        const cameraStore = useCameraStore.getState();
        cameraStore.setCamera(
          INITIAL_POSITIONS.mainIntro.position.clone(),
          INITIAL_POSITIONS.mainIntro.target.clone(),
          'main'
        );
        cameraStore.setIsLoading(true);
        router.push('/experience');
      },
    });

    entranceTimelineRef.current = tl;

    // Also fade out global UI (header/nav + custom cursor)
    const headerEl = document.querySelector('header') as HTMLElement | null;
    const navContainerEl = document.querySelector('header > div > div > div') as HTMLElement | null;
    const cursorEls = Array.from(
      document.querySelectorAll('.custom-cursor, .custom-cursor-outer')
    ) as HTMLElement[];

    const uiToFade: HTMLElement[] = [];
    if (headerEl) uiToFade.push(headerEl);
    if (navContainerEl) uiToFade.push(navContainerEl);
    if (cursorEls.length) uiToFade.push(...cursorEls);

    if (uiToFade.length) {
      tl.to(
        uiToFade,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onStart: () => {
            if (headerEl) headerEl.style.pointerEvents = 'none';
            if (navContainerEl) navContainerEl.style.pointerEvents = 'none';
          },
        },
        0 // Start alongside content fade
      );
    }

    // Animate content out
    if (contentRef.current) {
      tl.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power2.in',
      });
    }

    // Camera exit animation
    if (cameraRef.current) {
      const exitTarget = positions.target.clone();

      tl.to(
        cameraRef.current.position,
        {
          y: '+=200',
          duration: 2.5,
          ease: 'power2.in',
        },
        0.3
      );

      tl.to(
        exitTarget,
        {
          y: exitTarget.y + 300,
          duration: 2.5,
          ease: 'power2.in',
          onUpdate: () => cameraRef.current?.lookAt(exitTarget),
        },
        0.3
      );
    }
  });

  // Initialize content visibility based on store state
  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const alreadyAnimated = useLandingCameraStore.getState().hasAnimated;

    if (alreadyAnimated) {
      // If already animated, show content immediately
      gsap.set(contentRef.current, {
        opacity: 1,
        y: 0,
        visibility: 'visible',
      });
      // Portal interactivity handled centrally in wrapper
      animationStartedRef.current = true;
      setHasAnimated(true);
    } else {
      // Hide content initially for animation
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 20,
        visibility: 'hidden',
      });
    }
  }, [setHasAnimated]);

  // Trigger entrance animation when ready
  useEffect(() => {
    // Skip if already animated or currently animating
    if (animationStartedRef.current || hasAnimated) return;

    // Wait for camera to be ready and scene to be loaded
    if (cameraRef.current && isLoaded) {
      // Small delay to ensure everything is properly mounted
      const timer = setTimeout(() => {
        handleEnter();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasAnimated, handleEnter]);

  // Handle page visibility changes to prevent mouse/camera glitches during focus changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasVisible = isPageVisible.current;
      isPageVisible.current = !document.hidden;

      // When becoming visible again, preserve the last known good mouse position
      if (!wasVisible && isPageVisible.current) {
        // Restore mouse position to prevent camera jumps
        mousePosition.current.x = lastValidMousePosition.current.x;
        mousePosition.current.y = lastValidMousePosition.current.y;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimeline();
    };
  }, [cleanupTimeline]);

  // Camera mouse follow animation with smooth video transitions
  useFrame((state, delta) => {
    if (!cameraRef.current || isAnimating || !hasAnimated) return;

    // Only update mouse position when page is visible to prevent focus/blur glitches
    if (isPageVisible.current) {
      // Store current mouse position as the last valid position
      lastValidMousePosition.current.x = state.mouse.x;
      lastValidMousePosition.current.y = state.mouse.y;

      // Update working mouse position
      mousePosition.current.x = state.mouse.x;
      mousePosition.current.y = state.mouse.y;
    }
    // When page is not visible, keep using the last valid mouse position
    // This prevents camera jumps when returning to the tab

    // Calculate damping with UI and video considerations
    let dampingMultiplier = 1;

    if (isHoveringUI.current) {
      dampingMultiplier = MOUSE_CONFIG.uiDampingFactor;
    }

    // When video is playing, gradually reduce mouse influence for smooth transition
    if (isVideoPlaying) {
      dampingMultiplier *= 0.1; // Much stronger damping when video is active
    }

    // If mouse tracking is disabled, smoothly return to center
    if (!mouseTrackingEnabled) {
      dampingMultiplier = 0.02; // Very slow return to center
      // Target zero offset when tracking is disabled
      mousePosition.current.x = 0;
      mousePosition.current.y = 0;
    }

    // When page is not visible, apply extra damping to prevent drift
    if (!isPageVisible.current) {
      dampingMultiplier *= 0.5; // Slower camera movements when tab is not active
    }

    const effectiveDamping = currentConfig.mouseDamping * dampingMultiplier;
    const lerpFactor = 1 - Math.exp(-effectiveDamping * 60 * delta);

    // Apply camera offset with damping
    const targetInfluence = mouseTrackingEnabled ? currentConfig.mouseInfluence : 0;

    cameraOffset.current.x +=
      (mousePosition.current.x * targetInfluence - cameraOffset.current.x) * lerpFactor;
    cameraOffset.current.y +=
      (mousePosition.current.y * targetInfluence * 0.5 - cameraOffset.current.y) * lerpFactor;

    // Update camera position
    cameraRef.current.position.set(
      positions.camera.x + cameraOffset.current.x,
      positions.camera.y + cameraOffset.current.y,
      positions.camera.z
    );
    cameraRef.current.lookAt(positions.target);
  });

  return (
    <group>
      <Effects />
      <SceneEnvironment />
      <DesertModels />
      <AnimatedClouds />

      <VehiclesInstances useSharedMaterial={false}>
        <Vehicles />
      </VehiclesInstances>

      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        filmGauge={36}
        fov={30}
        near={0.1}
        far={10000}
        // Seed initial camera placement to stabilize viewport-dependent math
        position={[positions.initialCamera.x, positions.initialCamera.y, positions.initialCamera.z]}
      />

      <ambientLight intensity={0.05} />
      <Ground />

      <DreiBillboard follow={true}>
        <Html
          center
          position={positions.mainContent}
          transform
          prepend
          style={{
            pointerEvents: 'auto',
            zIndex: 30,
            transform: 'scale(2.5)',
          }}
        >
          <div
            ref={contentRef}
            className={`${textStyles.containerWidth} text-white`}
            onMouseEnter={handleMouseEnterUI}
            onMouseLeave={handleMouseLeaveUI}
            style={{
              zIndex: 30,
              opacity: 0,
              visibility: 'hidden',
              willChange: 'opacity, transform',
            }}
          >
            <p className={`mb-8 ${textStyles.textSize} leading-relaxed`}>
              With over 40 years of experience, O'Linn Security Inc. offers comprehensive security
              solutions tailored to your needs.
            </p>
            <Button
              size="sm"
              variant="button21"
              onClick={handleExit}
              className="relative text-white"
            >
              ENTER EXPERIENCE
            </Button>
          </div>
        </Html>
      </DreiBillboard>

      <Billboard
        position={positions.billboard.position}
        scale={positions.billboard.scale}
        textureVideo={textureVideo}
        modalVideo={modalVideo}
      />
    </group>
  );
});

LandingScene.displayName = 'LandingScene';

export default LandingScene;
