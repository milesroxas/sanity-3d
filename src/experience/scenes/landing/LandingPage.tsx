'use client';

import { Button } from '@/components/ui/button';
import { CustomCursor } from '@/components/ui/Cursor';
import gsap from 'gsap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface AnimationRefs {
  background: React.RefObject<HTMLDivElement | null>;
  content: React.RefObject<HTMLDivElement | null>;
  logo: React.RefObject<HTMLDivElement | null>;
  text: React.RefObject<HTMLParagraphElement | null>;
  button: React.RefObject<HTMLDivElement | null>;
}

export default function LandingPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  // Refs for animation targets
  const refs: AnimationRefs = {
    background: useRef<HTMLDivElement>(null),
    content: useRef<HTMLDivElement>(null),
    logo: useRef<HTMLDivElement>(null),
    text: useRef<HTMLParagraphElement>(null),
    button: useRef<HTMLDivElement>(null),
  };

  // Load-in animation
  useEffect(() => {
    // Set initial states
    gsap.set(refs.background.current, {
      opacity: 0,
      scale: 1.1,
    });
    gsap.set([refs.logo.current, refs.text.current, refs.button.current], {
      opacity: 0,
      y: 30,
    });

    // Create entrance animation
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    tl.to(refs.background.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
    })
      .to(
        refs.logo.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=1.3'
      )
      .to(
        refs.text.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=1.2'
      )
      .to(
        refs.button.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        '-=1.1'
      );

    return () => {
      tl.kill();
    };
  }, []);

  const createExitAnimation = () => {
    const tl = gsap.timeline({
      onComplete: () => router.push('/experience'),
    });

    // Fade out UI elements while background zooms
    tl.to([refs.button.current, refs.text.current, refs.logo.current], {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    })
      .to(
        refs.background.current,
        {
          scale: 1.05,
          duration: 1.5,
          ease: 'power3.out',
        },
        '<'
      )
      // Start moving down
      .to(
        refs.background.current,
        {
          y: 300,
          duration: 1.2,
          ease: 'power2.in',
        },
        '-=0.8'
      )
      // Fade out with a slight delay after movement starts
      .to(
        refs.background.current,
        {
          opacity: 0,
          duration: 1.2,
          ease: 'power3.inOut',
        },
        '-=0.8'
      );

    return tl;
  };

  const handleClick = async () => {
    setIsExiting(true);
    createExitAnimation();
  };

  return (
    <div className="fixed inset-0">
      <CustomCursor />
      {/* Background Layer */}
      <div
        ref={refs.background}
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/images/fpo-home-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="container relative top-[15vh] z-30 flex h-full justify-center">
        <div className="flex flex-col items-center gap-12">
          <div ref={refs.logo}>
            <Image
              className="h-auto w-auto"
              src="/images/logo.webp"
              alt="O'Linn Security Inc."
              width={100}
              height={100}
              priority
            />
          </div>
          <p ref={refs.text} className="max-w-lg text-center text-xl">
            With over 38 years of experience, O'Linn Security Inc. offers comprehensive security
            solutions tailored to your needs.
          </p>
          <div ref={refs.button}>
            <Button size="lg" onClick={handleClick}>
              ENTER EXPERIENCE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
