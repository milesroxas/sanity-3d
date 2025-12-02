'use client';
import { useCursorStore } from '@/components/ui/cursorStore';
import { Html, useCursor } from '@react-three/drei';
import gsap from 'gsap';
import { button, useControls } from 'leva';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PoiButtonProps {
  poi: Sanity.PointOfInterest;
  isVisible: boolean;
  isSelected: boolean;
  onClick: (poi: Sanity.PointOfInterest) => void;
  index?: number;
}

/**
 * PoiButton - 3D positioned interactive button for Points of Interest
 *
 * Features:
 * - Appears at specified 3D position after camera transition
 * - Animated entrance using GSAP
 * - Hover effects with cursor integration
 * - Prevents interaction during animations
 */
export function PoiButton({ poi, isVisible, isSelected, onClick, index = 0 }: PoiButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  const groupRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);

  // Leva controls for position adjustment
  const positionControls = useControls(
    `POI: ${poi.title}`,
    {
      x: {
        value: poi.markerPosition.x,
        min: -200,
        max: 200,
        step: 0.1,
        label: 'Position X',
      },
      y: {
        value: poi.markerPosition.y,
        min: 0,
        max: 100,
        step: 0.1,
        label: 'Position Y',
      },
      z: {
        value: poi.markerPosition.z,
        min: -200,
        max: 200,
        step: 0.1,
        label: 'Position Z',
      },
      'Copy Position': button(() => {
        const positionString = `{ x: ${positionControls.x}, y: ${positionControls.y}, z: ${positionControls.z} }`;
        navigator.clipboard.writeText(positionString);
        console.log('[PoiButton] Copied position:', positionString);
      }),
    },
    [poi.title]
  );

  // Debug: Log when controls are created
  useEffect(() => {
    console.log('[PoiButton] Leva controls created for:', poi.title, positionControls);
  }, [poi.title, positionControls]);

  // Apply cursor effect
  useCursor(isHovered && isVisible);

  // Animate in when visible
  useEffect(() => {
    if (!groupRef.current || !buttonRef.current) return;

    console.log('[PoiButton] Animation check:', { isVisible, hasAnimatedIn, index });

    if (isVisible && !hasAnimatedIn) {
      // Set initial state - start slightly below and scaled down
      gsap.set(groupRef.current.scale, { x: 0, y: 0, z: 0 });
      gsap.set(groupRef.current.position, {
        y: positionControls.y - 5,
      });
      gsap.set(buttonRef.current, { opacity: 0 });

      // Calculate stagger delay: 0.2s per button for more graceful sequencing
      const staggerDelay = index * 0.2;

      // Animate in with smooth, graceful motion
      const tl = gsap.timeline({
        delay: staggerDelay,
        onComplete: () => setHasAnimatedIn(true),
      });

      // Scale and position animation together for fluid motion
      tl.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: 'expo.out', // Smooth deceleration
      })
        .to(
          groupRef.current.position,
          {
            y: positionControls.y,
            duration: 0.8,
            ease: 'expo.out',
          },
          0 // Start at the same time as scale
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          0.2 // Slight delay for fade in
        );
    } else if (!isVisible && hasAnimatedIn) {
      // Animate out with graceful fade and slight downward motion
      const reverseStaggerDelay = index * 0.1;

      const tl = gsap.timeline({
        delay: reverseStaggerDelay,
        onComplete: () => setHasAnimatedIn(false),
      });

      tl.to(buttonRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
        .to(
          groupRef.current.position,
          {
            y: positionControls.y - 3,
            duration: 0.4,
            ease: 'power2.in',
          },
          0
        )
        .to(
          groupRef.current.scale,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.4,
            ease: 'power2.in',
          },
          0.1
        );
    }
  }, [isVisible, hasAnimatedIn, index, positionControls.y]);

  // Handle hover effects
  useEffect(() => {
    if (!buttonRef.current) return;

    if (isHovered && isVisible) {
      gsap.to(buttonRef.current, {
        scale: 1.1,
        backgroundColor: 'rgba(74, 222, 128, 0.95)',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(buttonRef.current, {
        scale: 1,
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isHovered, isVisible]);

  const handlePointerEnter = () => {
    if (isVisible && hasAnimatedIn) {
      setIsHovered(true);
      useCursorStore.getState().setHoveringInteractive(true);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    useCursorStore.getState().setHoveringInteractive(false);
  };

  const handleClick = () => {
    console.log('[PoiButton] Click:', {
      isVisible,
      hasAnimatedIn,
      isSelected,
      willTrigger: isVisible && hasAnimatedIn && !isSelected,
    });
    if (isVisible && hasAnimatedIn && !isSelected) {
      console.log('[PoiButton] Triggering onClick for:', poi.title);
      onClick(poi);
      useCursorStore.getState().setHoveringInteractive(false);
    }
  };

  const position: [number, number, number] = [
    positionControls.x,
    positionControls.y,
    positionControls.z,
  ];

  return (
    <group ref={groupRef} position={position}>
      {/* Hitbox for 3D interaction */}
      <mesh
        ref={hitboxRef}
        visible={isVisible}
        scale={[8, 8, 8]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* HTML Button */}
      <Html
        distanceFactor={25}
        zIndexRange={[100, 0]}
        occlude={false}
        center
        style={{
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <div
          ref={buttonRef}
          className="rounded-full px-6 py-3 shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.9)',
            pointerEvents: 'none',
            touchAction: 'none',
            whiteSpace: 'nowrap',
            transformOrigin: 'center center',
            opacity: 0,
          }}
        >
          <span className="text-sm font-bold text-white md:text-base">{poi.title}</span>
        </div>
      </Html>
    </group>
  );
}
