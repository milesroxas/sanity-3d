'use client';

import { Button } from '@/components/ui/button';
import { INITIAL_POSITIONS } from '@/experience/scenes/store/cameraStore';
import { useGSAP } from '@gsap/react';
import { Html, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useControls } from 'leva';
import { useRouter } from 'next/navigation';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
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
import { Ground } from './compositions/Ground';
import { useLandingCameraStore } from './store/landingCameraStore';

interface ResponsivePositions {
  camera: {
    start: Vector3;
    end: Vector3;
  };
  target: {
    start: Vector3;
    end: Vector3;
  };
  html: {
    start: Vector3;
    end: Vector3;
  };
  billboard: {
    position: Vector3;
    scale: number;
  };
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const LandingScene = forwardRef<
  any,
  {
    modalVideo?: Sanity.Video;
    portalRef: React.RefObject<HTMLDivElement>;
  }
>(({ modalVideo, portalRef }, ref) => {
  const [isReady, setIsReady] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { resetToInitial } = useCameraStore();
  const { isAnimating, setAnimating } = useLandingCameraStore();
  const buttonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [fadeOverlay, setFadeOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  // Get viewport information for responsive calculations
  const { viewport, size } = useThree();

  // Calculate responsive positions based on viewport
  const responsivePositions = useMemo((): ResponsivePositions => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;
    const aspectRatio = size.width / size.height;
    const isWideScreen = aspectRatio > 2;

    const textOffset = isMobile ? -viewport.width * 0.2 : -viewport.width * 0.35;
    const billboardOffset = isMobile ? viewport.width * -0.2 : viewport.width * 0.5;

    if (isMobile) {
      return {
        camera: {
          start: new Vector3(0, 12, 120),
          end: new Vector3(0, 4, 80),
        },
        target: {
          start: new Vector3(0, 10, 0),
          end: new Vector3(0, 12, 0),
        },
        html: {
          start: new Vector3(0, 8, 0),
          end: new Vector3(-3, 25, 0),
        },
        billboard: {
          position: new Vector3(billboardOffset, 0, -40),
          scale: 0.8,
        },
      };
    }

    if (isTablet) {
      return {
        camera: {
          start: new Vector3(15, 10, 110),
          end: new Vector3(20, 12, 90),
        },
        target: {
          start: new Vector3(-5, 10, 0),
          end: new Vector3(-3, 15, 0),
        },
        html: {
          start: new Vector3(textOffset, 10, 0),
          end: new Vector3(-12, 30, 0),
        },
        billboard: {
          position: new Vector3(-7, 0, -20),
          scale: 1,
        },
      };
    }

    // Desktop and wide screen
    const cameraZ = isWideScreen ? 120 : 100;
    const endCameraZ = isWideScreen ? 100 : 100;

    return {
      camera: {
        start: new Vector3(20, 7, cameraZ),
        end: new Vector3(25, 10, endCameraZ),
      },
      target: {
        start: new Vector3(-9, 12, 0),
        end: new Vector3(-7, 20, 0),
      },
      html: {
        start: new Vector3(textOffset, 12, 0),
        end: new Vector3(textOffset, 25, 0),
      },
      billboard: {
        position: new Vector3(-4, 0, -20),
        scale: 1.2,
      },
    };
  }, [viewport.width, size.width, size.height]);

  // Leva controls with proper typing
  const settings = useControls('Settings', {
    useResponsive: {
      value: true,
      label: 'Use Responsive Positioning',
    },
  });

  const manualCameraControls = useControls('Manual Camera', {
    position: {
      value: { x: 25, y: 10, z: 80 },
      render: get => !get('Settings.useResponsive'),
    },
    target: {
      value: { x: -7, y: 20, z: 0 },
      render: get => !get('Settings.useResponsive'),
    },
  });

  const manualHtmlControls = useControls('Manual HTML', {
    position: {
      value: { x: -15, y: 25, z: 0 },
      render: get => !get('Settings.useResponsive'),
    },
  });

  const manualBillboardControls = useControls('Manual Billboard', {
    position: {
      value: { x: -7, y: 0, z: -20 },
      render: get => !get('Settings.useResponsive'),
    },
    scale: {
      value: 1,
      min: 0.1,
      max: 2,
      step: 0.1,
      render: get => !get('Settings.useResponsive'),
    },
  });

  useControls('Debug', {
    deviceInfo: {
      value: `${size.width}x${size.height} | ${
        size.width < 768 ? 'Mobile' : size.width < 1024 ? 'Tablet' : 'Desktop'
      }`,
      editable: false,
    },
  });

  // Extract values with proper typing
  const useResponsive = settings.useResponsive as boolean;
  const manualCameraPosition = manualCameraControls.position as Vec3;
  const manualCameraTarget = manualCameraControls.target as Vec3;
  const manualHtmlPosition = manualHtmlControls.position as Vec3;
  const manualBillboardPosition = manualBillboardControls.position as Vec3;
  const manualBillboardScale = manualBillboardControls.scale as number;

  // Determine current positions based on mode and animation state
  const currentPositions = useMemo(() => {
    if (useResponsive) {
      const phase = !isReady || isAnimating ? 'start' : 'end';
      return {
        camera: responsivePositions.camera[phase],
        target: responsivePositions.target[phase],
        html: responsivePositions.html[phase],
        billboard: responsivePositions.billboard,
      };
    } else {
      return {
        camera: new Vector3(manualCameraPosition.x, manualCameraPosition.y, manualCameraPosition.z),
        target: new Vector3(manualCameraTarget.x, manualCameraTarget.y, manualCameraTarget.z),
        html: new Vector3(manualHtmlPosition.x, manualHtmlPosition.y, manualHtmlPosition.z),
        billboard: {
          position: new Vector3(
            manualBillboardPosition.x,
            manualBillboardPosition.y,
            manualBillboardPosition.z
          ),
          scale: manualBillboardScale,
        },
      };
    }
  }, [
    useResponsive,
    responsivePositions,
    isReady,
    isAnimating,
    manualCameraPosition,
    manualCameraTarget,
    manualHtmlPosition,
    manualBillboardPosition,
    manualBillboardScale,
  ]);

  // Ensure camera position is set before first render
  const initialCameraPosition = useMemo(() => {
    const { camera } = responsivePositions;
    return useResponsive
      ? camera.start.clone()
      : new Vector3(manualCameraPosition.x, manualCameraPosition.y, manualCameraPosition.z);
  }, [useResponsive, responsivePositions, manualCameraPosition]);

  // Ensure target position is set before first render
  const initialTargetPosition = useMemo(() => {
    const { target } = responsivePositions;
    return useResponsive
      ? target.start.clone()
      : new Vector3(manualCameraTarget.x, manualCameraTarget.y, manualCameraTarget.z);
  }, [useResponsive, responsivePositions, manualCameraTarget]);

  // Initialize camera refs with correct positions immediately
  useEffect(() => {
    animatedCamera.current = initialCameraPosition.clone();
    animatedTarget.current = initialTargetPosition.clone();
  }, [initialCameraPosition, initialTargetPosition]);

  // Animated values for smooth transitions
  const animatedCamera = useRef(currentPositions.camera.clone());
  const animatedTarget = useRef(currentPositions.target.clone());
  const animatedHtml = useRef(currentPositions.html.clone());

  // State for HTML position to trigger re-renders
  const [htmlPos, setHtmlPos] = useState(() => currentPositions.html.clone());

  // Track whether HTML elements are mounted
  const [htmlMounted, setHtmlMounted] = useState(false);

  // Reference for the HTML container
  const htmlContainerRef = useRef<HTMLDivElement>(null);

  // Effect to track when HTML elements are mounted
  useEffect(() => {
    if (htmlContainerRef.current && !htmlMounted) {
      setHtmlMounted(true);
    }
  }, [htmlContainerRef.current]);

  // Update camera in render loop
  useFrame(() => {
    if (cameraRef.current) {
      // Only animate if not using GSAP animation
      if (!isAnimating) {
        animatedCamera.current.lerp(currentPositions.camera, 0.1);
        animatedTarget.current.lerp(currentPositions.target, 0.1);
        animatedHtml.current.lerp(currentPositions.html, 0.1);

        // Update HTML position state if it has changed significantly
        if (animatedHtml.current.distanceTo(htmlPos) > 0.01) {
          setHtmlPos(animatedHtml.current.clone());
        }
      }

      cameraRef.current.position.copy(animatedCamera.current);
      cameraRef.current.lookAt(animatedTarget.current);
    }
  });

  // Handle exit animation
  const handleClick = () => {
    setAnimating(true);

    // Create a black material we can fade in
    const overlayMaterial = new MeshBasicMaterial({
      color: 'white',
      transparent: true,
      opacity: 0,
    });

    // Access camera store for the proper transition
    const cameraStore = useCameraStore.getState();

    const tl = gsap.timeline({
      onComplete: () => {
        // Set the camera position to match the main scene starting position
        // This ensures no awkward camera jump when transitioning scenes
        cameraStore.setCamera(
          INITIAL_POSITIONS.mainIntro.position.clone(),
          INITIAL_POSITIONS.mainIntro.target.clone(),
          'main'
        );

        // Set a flag in the store to avoid resetToInitial being called in MainSceneClient
        cameraStore.setIsLoading(true);

        // Navigate after setting camera state
        router.push('/experience');
      },
    });

    // Fade out UI elements first
    tl.to([buttonRef.current, textRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power2.inOut',
      stagger: 0.1,
    })
      // Start camera movement upward
      .to(
        [animatedCamera.current, animatedTarget.current],
        {
          y: '+=50',
          duration: 2,
          ease: 'power1.inOut',
        },
        '-=0.4'
      )
      // Fade in overlay when camera is 75% through its movement
      .to(
        overlayMaterial,
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            // Update the material opacity in the scene
            overlayMaterial.opacity = overlayMaterial.opacity;
          },
        },
        '-=1.5' // Start fading when the camera is 75% through its movement
      );

    // Add a full-screen overlay plane that we can fade in
    const overlayPlane = new Mesh(new PlaneGeometry(100, 100), overlayMaterial);
    overlayPlane.position.z = -10;
    overlayPlane.renderOrder = 999; // Ensure it renders on top
    cameraRef.current?.add(overlayPlane);
  };

  // GSAP entrance animation
  useGSAP(
    () => {
      // Only run animation when ready, using responsive positioning, not yet animated, and HTML elements are mounted
      if (!isReady || !useResponsive || hasAnimated || !htmlMounted) return;

      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Initialize animation variables
      const { camera, target, html } = responsivePositions;

      // Set initial positions
      animatedCamera.current.copy(camera.start);
      animatedTarget.current.copy(target.start);
      animatedHtml.current.copy(html.start);
      setHtmlPos(html.start.clone());
      setAnimating(true);

      // Make sure refs exist before using GSAP
      if (textRef.current && buttonRef.current) {
        gsap.set([textRef.current, buttonRef.current], { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          onComplete: () => {
            setAnimating(false);
            setHasAnimated(true);
            // Sync the HTML position state with the final animated position
            setHtmlPos(animatedHtml.current.clone());
          },
        });

        timelineRef.current = tl;

        // Animate positions
        tl.to(animatedCamera.current, {
          x: camera.end.x,
          y: camera.end.y,
          z: camera.end.z,
          duration: 3,
          ease: 'power2.out',
        })
          .to(
            animatedTarget.current,
            {
              x: target.end.x,
              y: target.end.y,
              z: target.end.z,
              duration: 2,
              ease: 'power2.out',
            },
            '<'
          )
          .to(
            animatedHtml.current,
            {
              x: html.end.x,
              y: html.end.y,
              z: html.end.z,
              duration: 3,
              ease: 'power2.out',
              onUpdate: () => {
                // Update HTML position state during animation
                setHtmlPos(animatedHtml.current.clone());
              },
            },
            '<'
          )
          .to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          })
          .to(
            buttonRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            '-=0.5'
          );
      }

      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
          timelineRef.current = null;
        }
      };
    },
    { dependencies: [isReady, useResponsive, hasAnimated, htmlMounted] }
  );

  // Component lifecycle
  useEffect(() => {
    // Set camera positions first
    animatedCamera.current = initialCameraPosition.clone();
    animatedTarget.current = initialTargetPosition.clone();

    // Then mark scene as ready
    setSceneReady(true);

    // Then set isReady with a slight delay to allow scene to stabilize
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      resetToInitial();
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [resetToInitial, initialCameraPosition, initialTargetPosition]);

  // Calculate responsive text size and container width
  const textStyles = useMemo(
    () => ({
      textSize: size.width < 768 ? 'text-lg' : 'text-2xl',
      containerWidth:
        size.width < 768 ? 'w-[280px]' : size.width < 1024 ? 'w-[400px]' : 'w-[500px]',
    }),
    [size.width]
  );

  return (
    <>
      {sceneReady && (
        <>
          <Effects />
          <SceneEnvironment />
          <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            filmGauge={36}
            fov={30}
            near={0.1}
            far={1000}
            position={initialCameraPosition}
          />

          <ambientLight intensity={0.05} />

          {isReady && (
            <group position={htmlPos}>
              <Html center>
                <div ref={htmlContainerRef} className="contents">
                  <div
                    ref={textRef}
                    className={`${textStyles.containerWidth} text-white ${isAnimating ? 'opacity-0' : ''}`}
                  >
                    <p className={`mb-8 ${textStyles.textSize} leading-relaxed`}>
                      With over 38 years of experience, O'Linn Security Inc. offers comprehensive
                      security solutions tailored to your needs.
                    </p>
                    <div ref={buttonRef} className={isAnimating ? 'opacity-0' : ''}>
                      <Button size="sm" onClick={handleClick}>
                        ENTER EXPERIENCE
                      </Button>
                    </div>
                  </div>
                </div>
              </Html>
            </group>
          )}

          <Billboard
            position={currentPositions.billboard.position}
            scale={currentPositions.billboard.scale}
            modalVideo={modalVideo}
            portalRef={portalRef}
          />

          <Ground />
          <DesertModels />
          <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#DCBF9A" transparent opacity={1} />
          </mesh>

          {fadeOverlay && (
            <Html fullscreen>
              <div className="absolute inset-0 bg-white opacity-100 transition-opacity duration-500" />
            </Html>
          )}
        </>
      )}
    </>
  );
});

LandingScene.displayName = 'LandingScene';

export default LandingScene;
