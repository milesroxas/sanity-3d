'use client';

import { Button } from '@/components/ui/button';
import { Float, Html, PerspectiveCamera, useProgress } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import { vehicles } from '@/experience/animations';
import { AnimatedClouds } from '@/experience/effects/components/Clouds';
import { VehiclesInstances } from '@/experience/models/VehiclesInstances';
import { INITIAL_POSITIONS, useCameraStore } from '@/experience/scenes/store/cameraStore';
import { getLinkData, SanityNav } from '@/store/navStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Euler,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
} from 'three';
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
    modalVideo?: any;
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

  const logoGroupRef = useRef<Group>(null);
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Add refs for HTML elements
  const linksRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { progress } = useProgress();
  const isLoaded = progress === 100;

  const responsiveConfig = useResponsiveConfig();
  const textStyles = useResponsiveTextStyles();

  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  const isHoveringUI = useRef(false);

  const { enabled: debugEnabled } = useDebugControls();
  useSceneInfoControls(size.width, size.height, hasAnimated && !isAnimating);

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
  const {
    positionX: billboardPositionX,
    positionY: billboardPositionY,
    positionZ: billboardPositionZ,
    scale: billboardScale,
  } = useBillboardControls(responsiveConfig.billboard.position, responsiveConfig.billboard.scale);
  const {
    positionX: logoPositionX,
    positionY: logoPositionY,
    positionZ: logoPositionZ,
    rotationX: logoRotationX,
    rotationY: logoRotationY,
    rotationZ: logoRotationZ,
  } = useLogoControls(responsiveConfig.logo.position, responsiveConfig.logo.rotation);
  const {
    positionX: linksPositionX,
    positionY: linksPositionY,
    positionZ: linksPositionZ,
  } = useLinksControls(responsiveConfig.links.position);
  const currentConfig = useMemo(() => {
    if (debugEnabled) {
      return {
        camera: {
          position: { x: cameraPositionX, y: cameraPositionY, z: cameraPositionZ },
          target: { x: cameraTargetX, y: cameraTargetY, z: cameraTargetZ },
        },
        mainContent: {
          position: { x: mainContentPositionX, y: mainContentPositionY, z: mainContentPositionZ },
          rotation: { x: mainContentRotationX, y: mainContentRotationY, z: mainContentRotationZ },
        },
        billboard: {
          position: { x: billboardPositionX, y: billboardPositionY, z: billboardPositionZ },
          scale: billboardScale,
        },
        logo: {
          position: { x: logoPositionX, y: logoPositionY, z: logoPositionZ },
          rotation: { x: logoRotationX, y: logoRotationY, z: logoRotationZ },
        },
        links: { position: { x: linksPositionX, y: linksPositionY, z: linksPositionZ } },
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

  const [mainContentPosition, setMainContentPosition] = useState(() =>
    positions.mainContent.clone()
  );
  const [mainContentRotation, setMainContentRotation] = useState(() =>
    positions.mainContentRotation.clone()
  );

  const handleMouseEnterUI = useCallback(() => {
    isHoveringUI.current = true;
  }, []);
  const handleMouseLeaveUI = useCallback(() => {
    isHoveringUI.current = false;
  }, []);

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

  // **FIX**: Get contextSafe function from useGSAP, but we will build the timelines dynamically.
  const { contextSafe } = useGSAP();

  const handleEnter = contextSafe(() => {
    if (!cameraRef.current || isAnimating || hasAnimated) return;

    // Create a timeline without using the selector
    const tl = gsap.timeline({
      onComplete: () => {
        setHasAnimated(true);
        setAnimating(false);
        if (overlayRef.current?.parent) {
          overlayRef.current.parent.remove(overlayRef.current);
          (overlayRef.current.material as MeshBasicMaterial).dispose();
          overlayRef.current = null;
        }
      },
    });
    entranceTimelineRef.current = tl;

    setAnimating(true);
    const overlay = createOverlay();
    if (!overlay) return;
    overlayRef.current = overlay.overlayPlane;

    // Fade in scene
    gsap.to(overlay.overlayMaterial, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
    });

    // Animate camera
    const startPosition = positions.camera.clone();
    startPosition.z += 200;
    cameraRef.current.position.copy(startPosition);
    tl.to(cameraRef.current.position, {
      ...positions.camera,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => cameraRef.current?.lookAt(positions.target),
      onComplete: () => {
        // Only start fading in elements after camera animation completes

        // Animate 3D Logo - ensure it starts invisible and scales up
        if (logoGroupRef.current) {
          // Set initial scale to 0
          logoGroupRef.current.scale.set(0, 0, 0);

          gsap.to(logoGroupRef.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
              // After logo animation, fade in the UI elements
              if (linksRef.current) {
                linksRef.current.style.transition =
                  'opacity 0.8s ease-out, transform 0.8s ease-out';
                linksRef.current.style.opacity = '1';
                linksRef.current.style.transform = 'translateY(0)';
              }

              setTimeout(() => {
                if (contentRef.current) {
                  contentRef.current.style.transition =
                    'opacity 0.8s ease-out, transform 0.8s ease-out';
                  contentRef.current.style.opacity = '1';
                  contentRef.current.style.transform = 'translateY(0)';
                }
              }, 300); // Slightly after links
            },
          });
        }
      },
    });

    tl.play();
  });

  const handleExit = contextSafe(() => {
    if (isAnimating) return;
    setAnimating(true);

    const overlay = createOverlay();
    if (!overlay) return;
    overlayRef.current = overlay.overlayPlane;
    overlay.overlayMaterial.opacity = 0;

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

    // Use direct DOM manipulation for exit animations
    if (linksRef.current) {
      linksRef.current.style.transition = 'opacity 0.6s ease-in, transform 0.6s ease-in';
      linksRef.current.style.opacity = '0';
      linksRef.current.style.transform = 'translateY(-20px)';
    }

    if (contentRef.current) {
      contentRef.current.style.transition = 'opacity 0.6s ease-in, transform 0.6s ease-in';
      contentRef.current.style.opacity = '0';
      contentRef.current.style.transform = 'translateY(-20px)';
    }

    // Animate 3D logo out
    if (logoGroupRef.current) {
      tl.to(
        logoGroupRef.current.scale,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.6,
          ease: 'power2.in',
        },
        0
      );
    }

    // Animate camera
    if (cameraRef.current) {
      const targetClone = positions.target.clone();
      tl.to(
        cameraRef.current.position,
        {
          y: '+=50',
          duration: 1.5,
          ease: 'power2.in',
        },
        0.3
      );

      tl.to(
        targetClone,
        {
          y: '+=55',
          duration: 1.5,
          ease: 'power2.in',
          onUpdate: () => cameraRef.current?.lookAt(targetClone),
        },
        0.3
      );
    }

    tl.to(
      overlay.overlayMaterial,
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.in',
      },
      1
    );

    tl.play();
  });

  // Add useLayoutEffect to ensure HTML elements are properly initialized
  useLayoutEffect(() => {
    if (linksRef.current) {
      linksRef.current.style.opacity = '0';
      linksRef.current.style.transform = 'translateY(-20px)';
      linksRef.current.style.pointerEvents = 'auto'; // Ensure links are clickable
    }

    if (contentRef.current) {
      contentRef.current.style.opacity = '0';
      contentRef.current.style.transform = 'translateY(20px)';
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !hasAnimated && !isAnimating) {
      requestAnimationFrame(() => {
        handleEnter();
      });
    }
  }, [isLoaded, hasAnimated, isAnimating, handleEnter]);

  useEffect(() => {
    return () => {
      if (overlayRef.current?.parent) {
        overlayRef.current.parent.remove(overlayRef.current);
        (overlayRef.current.material as MeshBasicMaterial)?.dispose();
      }
      entranceTimelineRef.current?.kill();
      resetToInitial();
    };
  }, [resetToInitial]);

  useEffect(() => {
    // Initialize the logo scale to 1 when not animating
    if (logoGroupRef.current && !isAnimating && hasAnimated) {
      logoGroupRef.current.scale.set(1, 1, 1);
    }
  }, [hasAnimated, isAnimating]);

  // Update the fallback mechanism to match the new link styling
  useEffect(() => {
    if (hasAnimated && portalRef.current) {
      // Check if links are visible after animation is complete
      setTimeout(() => {
        if (linksRef.current) {
          const opacity = window.getComputedStyle(linksRef.current).opacity;
          const computedVisibility = window.getComputedStyle(linksRef.current).visibility;
          const isLinkVisible = parseFloat(opacity) > 0.5 && computedVisibility !== 'hidden';

          // If links are not visible, create a fallback
          if (!isLinkVisible) {
            // Get position from config for fallback positioning
            const linksPosX = currentConfig.links.position.x;
            const linksPosY = currentConfig.links.position.y;

            // Convert 3D position to screen position (approximate)
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const screenX = (linksPosX / 10 + 0.5) * screenWidth;
            const screenY = (-linksPosY / 10 + 0.5) * screenHeight;

            // Create fallback links directly in the portal div
            const fallbackLinks = document.createElement('div');
            fallbackLinks.className = 'fallback-links';
            fallbackLinks.style.cssText = `
              position: absolute;
              top: ${screenY}px;
              left: ${screenX}px;
              transform: translate(-50%, -50%);
              display: flex;
              justify-content: space-between;
              gap: 48px;
              z-index: 1000;
              pointer-events: auto;
              width: 80%;
              max-width: 1200px;
            `;

            if (nav.companyLinks && nav.companyLinks.length > 0) {
              nav.companyLinks.forEach((link, index) => {
                const linkData = getLinkData(link);
                const linkElement = document.createElement('a');
                linkElement.href = linkData.href;
                if (linkData.target) {
                  linkElement.target = '_blank';
                  linkElement.rel = 'noopener noreferrer';
                }
                linkElement.textContent = linkData.label;
                linkElement.className =
                  'text-md w-full font-semibold transition-colors duration-300 hover:text-green-100';
                linkElement.style.cssText = `
                  color: white;
                  text-decoration: none;
                  cursor: pointer;
                  padding: 8px 16px;
                  flex: 1;
                  width: 100%;
                  display: block;
                `;

                fallbackLinks.appendChild(linkElement);
              });

              portalRef.current.appendChild(fallbackLinks);
            }
          }
        }
      }, 5000); // Check after animations are complete
    }

    return () => {
      // Clean up fallback links on unmount
      if (portalRef.current) {
        const fallbackLinks = portalRef.current.querySelector('.fallback-links');
        if (fallbackLinks) {
          portalRef.current.removeChild(fallbackLinks);
        }
      }
    };
  }, [hasAnimated, nav.companyLinks, portalRef, currentConfig.links.position]);

  useFrame((state, delta) => {
    if (!cameraRef.current || isAnimating || !hasAnimated) return;

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
    cameraRef.current.position.set(
      positions.camera.x + cameraOffset.current.x,
      positions.camera.y + cameraOffset.current.y,
      positions.camera.z
    );
    cameraRef.current.lookAt(positions.target);
  });

  useFrame(() => {
    if (!isAnimating) {
      if (positions.mainContent.distanceTo(mainContentPosition) > 0.01) {
        setMainContentPosition(positions.mainContent.clone());
      }
      if (
        Math.abs(mainContentRotation.x - positions.mainContentRotation.x) > 0.01 ||
        Math.abs(mainContentRotation.y - positions.mainContentRotation.y) > 0.01 ||
        Math.abs(mainContentRotation.z - positions.mainContentRotation.z) > 0.01
      ) {
        setMainContentRotation(positions.mainContentRotation.clone());
      }
    }
  });

  return (
    <group>
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
        {/* Position the logo group according to config */}
        <group
          ref={logoGroupRef}
          position={[
            currentConfig.logo.position.x,
            currentConfig.logo.position.y,
            currentConfig.logo.position.z,
          ]}
          rotation={[
            currentConfig.logo.rotation.x,
            currentConfig.logo.rotation.y,
            currentConfig.logo.rotation.z,
          ]}
        >
          {/* The Logo component doesn't need position since it's positioned by the parent group */}
          <Logo />
        </group>
      </Float>

      {/* Position links according to config */}
      <Html
        position={[
          currentConfig.links.position.x,
          currentConfig.links.position.y,
          currentConfig.links.position.z,
        ]}
        portal={portalRef}
        prepend
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: 'auto', // Enable pointer events
          width: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          ref={linksRef}
          className="flex w-full flex-row gap-12"
          onMouseEnter={handleMouseEnterUI}
          onMouseLeave={handleMouseLeaveUI}
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          {nav.companyLinks && nav.companyLinks.length > 0 ? (
            nav.companyLinks.map((link, index) => {
              const linkData = getLinkData(link);
              return (
                <Link
                  key={`company-${index}`}
                  href={linkData.href}
                  target={linkData.target ? '_blank' : undefined}
                  rel={linkData.target ? 'noopener noreferrer' : undefined}
                  className="text-md w-full font-semibold text-green-800 transition-colors duration-300 hover:text-green-100"
                  style={{
                    display: 'block',
                    flex: '1',
                    width: '100%',
                  }}
                >
                  {linkData.label}
                </Link>
              );
            })
          ) : (
            <span>No links available</span>
          )}
        </div>
      </Html>

      <Html
        center
        position={mainContentPosition}
        transform
        rotation={mainContentRotation}
        portal={portalRef}
        prepend
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: 'auto', // Enable pointer events
        }}
      >
        <div
          ref={contentRef}
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
    </group>
  );
});

LandingScene.displayName = 'LandingScene';

export default LandingScene;
