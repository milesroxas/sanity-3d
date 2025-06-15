'use client';

import { Button } from '@/components/ui/button';
import { Float, Html, PerspectiveCamera, useProgress } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import { vehicles } from '@/experience/animations';
import { AnimatedClouds } from '@/experience/effects/components/Clouds';
import { VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { INITIAL_POSITIONS } from '@/experience/scenes/store/cameraStore';
import { getLinkData, SanityNav } from '@/store/navStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Euler,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
} from 'three';
import { useCameraStore } from '../store/cameraStore';
import { Billboard } from './components/Billboard';
import { Effects } from './components/Effects';
import { SceneEnvironment } from './components/SceneEnvironment';
import { DesertModels } from './compositions/DesertModels';
import { Logo } from './compositions/Logo';
import {
  useBillboardControls,
  useCameraControls,
  useDebugControls,
  useLinksControls,
  useLogoControls,
  useMainContentControls,
  useSceneInfoControls,
} from './config/controls';
import { MOUSE_CONFIG } from './config/mouseConfig';
import { useResponsiveConfig, useResponsiveTextStyles } from './hooks/useResponsiveConfig';
import { useLandingCameraStore } from './store/landingCameraStore';

const LandingScene = forwardRef<
  any,
  {
    modalVideo?: Sanity.Video;
    portalRef: React.RefObject<HTMLDivElement>;
    nav: SanityNav;
  }
>(({ modalVideo, portalRef, nav }, ref) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const { resetToInitial } = useCameraStore();
  const { isAnimating, setAnimating } = useLandingCameraStore();
  const router = useRouter();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const { size } = useThree();
  const overlayRef = useRef<Mesh | null>(null);

  // Container ref for GSAP scope
  const containerRef = useRef<HTMLDivElement>(null);

  // Timeline references
  const entranceTimelineRef = useRef<gsap.core.Timeline>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline>(null);

  const logoHtmlRef = useRef<HTMLDivElement>(null);
  const mainContentHtmlRef = useRef<HTMLDivElement>(null);
  const linksHtmlRef = useRef<HTMLDivElement>(null);

  // Use Drei's progress hook to track loading
  const { progress } = useProgress();
  const isLoaded = progress === 100;

  // Get responsive configuration
  const responsiveConfig = useResponsiveConfig();
  const textStyles = useResponsiveTextStyles();

  // Mouse interaction state
  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  const isHoveringUI = useRef(false);

  // Debug controls
  const { enabled: debugEnabled } = useDebugControls();

  // Use scene info controls
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
    rotationX: mainContentRotationX,
    rotationY: mainContentRotationY,
    rotationZ: mainContentRotationZ,
  } = useMainContentControls(
    responsiveConfig.mainContent.position,
    responsiveConfig.mainContent.rotation
  );

  // Billboard controls
  const {
    positionX: billboardPositionX,
    positionY: billboardPositionY,
    positionZ: billboardPositionZ,
    scale: billboardScale,
  } = useBillboardControls(responsiveConfig.billboard.position, responsiveConfig.billboard.scale);

  // Logo controls
  const {
    positionX: logoPositionX,
    positionY: logoPositionY,
    positionZ: logoPositionZ,
    rotationX: logoRotationX,
    rotationY: logoRotationY,
    rotationZ: logoRotationZ,
  } = useLogoControls(responsiveConfig.logo.position, responsiveConfig.logo.rotation);

  // Links controls
  const {
    positionX: linksPositionX,
    positionY: linksPositionY,
    positionZ: linksPositionZ,
  } = useLinksControls(responsiveConfig.links.position);

  // Use debug controls only when enabled, otherwise use responsive config
  const currentConfig = useMemo(() => {
    if (debugEnabled) {
      return {
        camera: {
          position: {
            x: cameraPositionX,
            y: cameraPositionY,
            z: cameraPositionZ,
          },
          target: {
            x: cameraTargetX,
            y: cameraTargetY,
            z: cameraTargetZ,
          },
        },
        mainContent: {
          position: {
            x: mainContentPositionX,
            y: mainContentPositionY,
            z: mainContentPositionZ,
          },
          rotation: {
            x: mainContentRotationX,
            y: mainContentRotationY,
            z: mainContentRotationZ,
          },
        },
        billboard: {
          position: {
            x: billboardPositionX,
            y: billboardPositionY,
            z: billboardPositionZ,
          },
          scale: billboardScale,
        },
        logo: {
          position: {
            x: logoPositionX,
            y: logoPositionY,
            z: logoPositionZ,
          },
          rotation: {
            x: logoRotationX,
            y: logoRotationY,
            z: logoRotationZ,
          },
        },
        links: {
          position: {
            x: linksPositionX,
            y: linksPositionY,
            z: linksPositionZ,
          },
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
    cameraPositionX,
    cameraPositionY,
    cameraPositionZ,
    cameraTargetX,
    cameraTargetY,
    cameraTargetZ,
    mainContentPositionX,
    mainContentPositionY,
    mainContentPositionZ,
    mainContentRotationX,
    mainContentRotationY,
    mainContentRotationZ,
    billboardPositionX,
    billboardPositionY,
    billboardPositionZ,
    billboardScale,
    logoPositionX,
    logoPositionY,
    logoPositionZ,
    logoRotationX,
    logoRotationY,
    logoRotationZ,
    linksPositionX,
    linksPositionY,
    linksPositionZ,
    mouseInfluence,
    mouseDamping,
    responsiveConfig,
  ]);

  // Convert to Vector3 objects
  const positions = useMemo(
    () => ({
      camera: new Vector3(
        currentConfig.camera.position.x,
        currentConfig.camera.position.y,
        currentConfig.camera.position.z
      ),
      target: new Vector3(
        currentConfig.camera.target.x,
        currentConfig.camera.target.y,
        currentConfig.camera.target.z
      ),
      mainContent: new Vector3(
        currentConfig.mainContent.position.x,
        currentConfig.mainContent.position.y,
        currentConfig.mainContent.position.z
      ),
      mainContentRotation: new Euler(
        currentConfig.mainContent.rotation.x,
        currentConfig.mainContent.rotation.y,
        currentConfig.mainContent.rotation.z
      ),
      billboard: {
        position: new Vector3(
          currentConfig.billboard.position.x,
          currentConfig.billboard.position.y,
          currentConfig.billboard.position.z
        ),
        scale: currentConfig.billboard.scale,
      },
      logo: {
        position: new Vector3(
          currentConfig.logo.position.x,
          currentConfig.logo.position.y,
          currentConfig.logo.position.z
        ),
        rotation: new Euler(
          currentConfig.logo.rotation.x,
          currentConfig.logo.rotation.y,
          currentConfig.logo.rotation.z
        ),
      },
      links: {
        position: new Vector3(
          currentConfig.links.position.x,
          currentConfig.links.position.y,
          currentConfig.links.position.z
        ),
      },
    }),
    [currentConfig]
  );

  // State for main content position to trigger re-renders
  const [mainContentPosition, setMainContentPosition] = useState(() =>
    positions.mainContent.clone()
  );
  const [mainContentRotation, setMainContentRotation] = useState(() =>
    positions.mainContentRotation.clone()
  );

  // Mouse interaction handlers
  const handleMouseEnterUI = useCallback(() => {
    isHoveringUI.current = true;
  }, []);

  const handleMouseLeaveUI = useCallback(() => {
    isHoveringUI.current = false;
  }, []);

  // Create overlay helper
  const createOverlay = useCallback(() => {
    if (!cameraRef.current) return null;

    const overlayMaterial = new MeshBasicMaterial({
      color: 'white',
      transparent: true,
      opacity: 1,
    });

    const overlayPlane = new Mesh(new PlaneGeometry(100, 100), overlayMaterial);
    overlayPlane.position.z = -10;
    overlayPlane.renderOrder = 999;
    cameraRef.current.add(overlayPlane);

    return { overlayPlane, overlayMaterial };
  }, []);

  // Main GSAP hook with context-safe animations
  const { contextSafe } = useGSAP(
    () => {
      // Create entrance timeline (paused initially)
      entranceTimelineRef.current = gsap.timeline({
        paused: true,
        onComplete: () => {
          setHasAnimated(true);
          setAnimating(false);
          // Clean up overlay
          if (overlayRef.current && overlayRef.current.parent) {
            overlayRef.current.parent.remove(overlayRef.current);
            if (Array.isArray(overlayRef.current.material)) {
              overlayRef.current.material.forEach(mat => mat.dispose());
            } else {
              overlayRef.current.material.dispose();
            }
            overlayRef.current = null;
          }
        },
      });

      // Set up entrance animation
      if (cameraRef.current) {
        const startPosition = positions.camera.clone();
        startPosition.z += 200;

        // Set initial camera position
        cameraRef.current.position.copy(startPosition);

        // Camera animation
        entranceTimelineRef.current.to(cameraRef.current.position, {
          x: positions.camera.x,
          y: positions.camera.y,
          z: positions.camera.z,
          duration: 4,
          ease: 'power2.out',
          onUpdate: () => {
            if (cameraRef.current) {
              cameraRef.current.lookAt(positions.target);
            }
          },
        });

        const uiElements = [
          logoHtmlRef.current,
          mainContentHtmlRef.current,
          linksHtmlRef.current,
        ].filter(Boolean);

        if (uiElements.length > 0) {
          entranceTimelineRef.current.fromTo(
            uiElements,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
            },
            '-=2'
          );
        }
      }
    },
    {
      dependencies: [positions.camera, positions.target],
    }
  );

  // Context-safe entrance handler
  const handleEnter = contextSafe(() => {
    if (!cameraRef.current || isAnimating || hasAnimated) return;

    setAnimating(true);

    // Create and setup overlay
    const overlay = createOverlay();
    if (!overlay) return;

    const { overlayPlane, overlayMaterial } = overlay;
    overlayRef.current = overlayPlane;

    // Animate overlay fade out
    gsap.to(overlayMaterial, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        // Play entrance timeline after overlay fades
        entranceTimelineRef.current?.play();
      },
    });
  });

  // Context-safe exit handler
  const handleExit = contextSafe(() => {
    if (isAnimating) return;

    setAnimating(true);

    // Create overlay for exit
    const overlay = createOverlay();
    if (!overlay) return;

    const { overlayPlane, overlayMaterial } = overlay;
    overlayRef.current = overlayPlane;
    overlayMaterial.opacity = 0;

    // Create exit timeline
    exitTimelineRef.current = gsap.timeline({
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

    const uiElements = [
      logoHtmlRef.current,
      mainContentHtmlRef.current,
      linksHtmlRef.current,
    ].filter(Boolean);

    if (uiElements.length > 0) {
      exitTimelineRef.current.to(uiElements, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.in',
      });
    }

    // Animate camera up
    if (cameraRef.current) {
      exitTimelineRef.current.to(
        cameraRef.current.position,
        {
          y: '+=50',
          duration: 1.5,
          ease: 'power2.in',
        },
        '-=0.3'
      );

      // Also animate target up for smooth look
      exitTimelineRef.current.to(
        positions.target,
        {
          y: '+=55',
          duration: 1.5,
          ease: 'power2.in',
          onUpdate: () => {
            if (cameraRef.current) {
              cameraRef.current.lookAt(positions.target);
            }
          },
        },
        '<' // Start at same time as camera animation
      );
    }

    // Fade in overlay
    exitTimelineRef.current.to(
      overlayMaterial,
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.in',
      },
      '-=1'
    );
  });

  // Trigger entrance animation when loaded
  useEffect(() => {
    if (isLoaded && !hasAnimated && !isAnimating) {
      requestAnimationFrame(() => {
        handleEnter();
      });
    }
  }, [isLoaded, hasAnimated, isAnimating, handleEnter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // GSAP animations are automatically cleaned up by useGSAP
      // Just clean up overlay if it exists
      if (overlayRef.current && overlayRef.current.parent) {
        overlayRef.current.parent.remove(overlayRef.current);
        if (overlayRef.current.material) {
          if (Array.isArray(overlayRef.current.material)) {
            overlayRef.current.material.forEach(mat => mat.dispose());
          } else {
            overlayRef.current.material.dispose();
          }
        }
      }
      resetToInitial();
    };
  }, [resetToInitial]);

  // useFrame for continuous mouse interaction only
  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    // During animation, let GSAP handle everything
    if (isAnimating) {
      // Update main content position for UI
      if (positions.mainContent.distanceTo(mainContentPosition) > 0.01) {
        setMainContentPosition(positions.mainContent.clone());
      }
      return;
    }

    // Apply mouse interaction only after animation is complete
    if (hasAnimated) {
      mousePosition.current.x = state.mouse.x;
      mousePosition.current.y = state.mouse.y;

      const dampingMultiplier = isHoveringUI.current ? MOUSE_CONFIG.uiDampingFactor : 1;
      const effectiveDamping = currentConfig.mouseDamping * dampingMultiplier;
      const lerpFactor = 1 - Math.exp(-effectiveDamping * 60 * delta);

      cameraOffset.current.x +=
        (mousePosition.current.x * currentConfig.mouseInfluence - cameraOffset.current.x) *
        lerpFactor;
      cameraOffset.current.y +=
        (mousePosition.current.y * currentConfig.mouseInfluence * 0.5 - cameraOffset.current.y) *
        lerpFactor;

      // Apply final camera position with mouse offset
      cameraRef.current.position.set(
        positions.camera.x + cameraOffset.current.x,
        positions.camera.y + cameraOffset.current.y,
        positions.camera.z
      );

      cameraRef.current.lookAt(positions.target);
    }

    // Update main content position state
    if (positions.mainContent.distanceTo(mainContentPosition) > 0.01) {
      setMainContentPosition(positions.mainContent.clone());
    }

    // Update main content rotation
    if (
      Math.abs(mainContentRotation.x - positions.mainContentRotation.x) > 0.01 ||
      Math.abs(mainContentRotation.y - positions.mainContentRotation.y) > 0.01 ||
      Math.abs(mainContentRotation.z - positions.mainContentRotation.z) > 0.01
    ) {
      setMainContentRotation(positions.mainContentRotation.clone());
    }
  });

  return (
    <>
      <Effects />
      <SceneEnvironment />
      <DesertModels />
      <AnimatedClouds />
      <VehiclesInstances useSharedMaterial={false}>
        <vehicles.AnimatedPlane pathOffset={0.85} scale={0.3} />
      </VehiclesInstances>

      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        filmGauge={36}
        fov={30}
        near={0.1}
        far={10000}
        position={positions.camera}
      />

      <ambientLight intensity={0.05} />

      <Float speed={0.7} floatIntensity={0.2} rotationIntensity={0.1} floatingRange={[-0.4, 0.4]}>
        <group position={[8, 0, 0]} rotation={positions.logo.rotation}>
          <Logo ref={logoHtmlRef} position={positions.logo.position} />
          <Html ref={linksHtmlRef} position={positions.links.position} style={{ opacity: 0 }}>
            <div
              className="flex w-screen flex-row gap-6"
              onMouseEnter={handleMouseEnterUI}
              onMouseLeave={handleMouseLeaveUI}
            >
              {nav.companyLinks?.map((link, index) => {
                const linkData = getLinkData(link);
                return (
                  <Link
                    key={`company-${index}`}
                    href={linkData.href}
                    target={linkData.target ? '_blank' : undefined}
                    rel={linkData.target ? 'noopener noreferrer' : undefined}
                    className="text-md font-semibold transition-colors duration-300 hover:text-green-100"
                  >
                    {linkData.label}
                  </Link>
                );
              })}
            </div>
          </Html>
        </group>
      </Float>

      <Html
        center
        ref={mainContentHtmlRef}
        position={mainContentPosition}
        transform
        rotation={mainContentRotation}
        style={{ opacity: 0 }}
      >
        <div
          className={`${textStyles.containerWidth} text-white`}
          onMouseEnter={handleMouseEnterUI}
          onMouseLeave={handleMouseLeaveUI}
        >
          <p className={`mb-8 ${textStyles.textSize} leading-relaxed`}>
            With over 38 years of experience, O'Linn Security Inc. offers comprehensive security
            solutions tailored to your needs.
          </p>
          <Button size="sm" variant="button21" onClick={handleExit} className="relative text-white">
            ENTER EXPERIENCE
          </Button>
        </div>
      </Html>

      <Billboard
        position={positions.billboard.position}
        scale={positions.billboard.scale}
        modalVideo={modalVideo}
        portalRef={portalRef}
      />
    </>
  );
});

LandingScene.displayName = 'LandingScene';

export default LandingScene;
