"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";

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

  const createExitAnimation = () => {
    const tl = gsap.timeline({
      onComplete: () => router.push("/experience")
    });

    // Fade out UI elements first
    tl.to([refs.button.current, refs.text.current, refs.logo.current], {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut"
    })
    // Start background animation before UI fade completes
    .to(refs.background.current, {
      y: 300,
      duration: 1.2,
      ease: "power2.in"
    }) // Start 0.4s before UI fade completes
    .to(refs.background.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, "-=0.8");

    return tl;
  };

  const handleClick = async () => {
    setIsExiting(true);
    createExitAnimation();
  };

  return (
    <div className="fixed inset-0">
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

      <div className="relative z-30 h-full flex top-[15vh] justify-center container">
        <div className="flex flex-col items-center gap-12">
          <div ref={refs.logo}>
            <Image
              src="/images/logo.webp"
              alt="O'Linn Security Inc."
              width={100}
              height={100}
              priority
            />
          </div>
          <p ref={refs.text} className="text-xl text-center max-w-lg">
            With over 38 years of experience, O'Linn Security Inc. offers
            comprehensive security solutions tailored to your needs.
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
