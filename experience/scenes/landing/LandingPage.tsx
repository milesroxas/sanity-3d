"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";

export default function LandingPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  
  // Refs for animation targets
  const backgroundRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  const handleClick = async () => {
    setIsExiting(true);
    
    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => router.push("/experience")
    });

    // Background animation
    tl.to(backgroundRef.current, {
      y: 200,
      duration: 1.2,
      ease: "power2.in"
    })
    .to(backgroundRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.in"
    }, "-=1.2")

    // Content animations
    .to([textRef.current, buttonRef.current], {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, "-=1.2")

    // Logo animation - starts much earlier
    .to(logoRef.current, {
      y: 200,
      duration: 0.8,
      ease: "power2.inOut"
    }, "-=0.5") // Start while content is still moving
    .to(logoRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    }, "-=0.3");
  };

  return (
    <div className="fixed inset-0">
      {/* Background Layer */}
      <div 
        ref={backgroundRef}
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
          <div ref={logoRef}>
            <Image
              src="/images/logo.webp"
              alt="O'Linn Security Inc."
              width={100}
              height={100}
            />
          </div>
          <p ref={textRef} className="text-xl text-center max-w-lg">
            With over 38 years of experience, O'Linn Security Inc. offers
            comprehensive security solutions tailored to your needs.
          </p>
          <div ref={buttonRef}>
            <Button size="lg" onClick={handleClick}>
              ENTER EXPERIENCE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
