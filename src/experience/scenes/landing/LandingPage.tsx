'use client';
import { Button } from '@/components/ui/button';
import { R3FProvider } from '@/experience/providers/R3FContext';
import gsap from 'gsap';
import { Leva } from 'leva';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LandingWrapper from './LandingWrapper';
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'development';

export default function LandingPage() {
  const router = useRouter();

  // Refs for animation targets
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isExiting, setIsExiting] = useState(false);

  // Prevent scrolling on landing page
  useEffect(() => {
    // Save original styles
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    // Apply no-scroll styles
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  const handleClick = () => {
    setIsExiting(true);

    // Create exit animation
    const tl = gsap.timeline({
      onComplete: () => router.push('/experience'),
    });

    // Fade out UI elements
    tl.to([buttonRef.current, textRef.current, logoRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power2.inOut',
      stagger: 0.1,
    });
  };

  return (
    <R3FProvider>
      <LandingWrapper>
        {/* Your HTML content here */}
        <div className="max-w-full text-white">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Our 3D Experience</h1>
          <p className="mb-6">Explore our interactive 3D world and discover our services.</p>
          <div ref={buttonRef}>
            <Button size="lg" onClick={handleClick}>
              ENTER EXPERIENCE
            </Button>
          </div>
        </div>
      </LandingWrapper>

      {/* Hide Leva in production, show in development */}
      <Leva hidden={isProduction} />
    </R3FProvider>
  );
}
