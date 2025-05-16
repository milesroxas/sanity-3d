'use client';

import { useGSAP } from '@gsap/react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import gsap from 'gsap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { Button } from '../ui/button';

export default function PreFooter() {
  const pathname = usePathname();
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  if (pathname === '/' || pathname === '/experience' || pathname?.startsWith('/experience/')) {
    return null;
  }

  // Setup initial state with useGSAP
  useGSAP(
    () => {
      if (iconRef.current) {
        // Set initial state
        gsap.set(iconRef.current, {
          opacity: 0,
          x: -10,
        });
      }
    },
    { scope: iconRef }
  );

  const handleHover = () => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.25,
        ease: 'power2.inOut',
      });
    }

    if (textRef.current) {
      // Using CSS variables to animate gradient colors
      gsap.to(textRef.current, {
        '--gradient-from': '#DBFF93',
        '--gradient-to': '#00FF65',
        duration: 0.5,
        y: -10,
        ease: 'power2.out',
      });
    }
  };

  // Handle hover out animation
  const handleHoverOut = () => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        opacity: 0,
        x: -10,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    }

    if (textRef.current) {
      // Animate gradient back to original colors
      gsap.to(textRef.current, {
        '--gradient-from': '#A6D3B6',
        '--gradient-to': '#9DFFC4',
        duration: 0.5,
        y: 0,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section className="relative pt-24">
      {/* Background image */}

      {/* Content container */}
      <div className="w-full">
        <div className="container relative z-20 pb-24">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <p className="w-full text-lg font-light leading-relaxed text-white md:text-xl lg:w-1/2 xl:text-3xl">
              Request your personalized security proposal from our family‑owned local leaders who've
              been safeguarding communities for 40 years.
            </p>

            {/* Button group with grid for equal width buttons */}
            <div className="grid w-full grid-cols-1 gap-6 lg:w-auto lg:grid-cols-2">
              <Button
                size="lg"
                variant="outline"
                className="w-full whitespace-normal bg-white text-black hover:bg-gray-100"
              >
                Contact Us
              </Button>
              <Button size="lg" className="w-full whitespace-normal text-white">
                Request a Proposal
              </Button>
            </div>
          </div>
        </div>
        <div className="relative h-[80vh]">
          <Link
            href="/"
            onMouseEnter={handleHover}
            onMouseLeave={handleHoverOut}
            className="relative z-40 flex w-full flex-col items-center gap-6"
          >
            <div
              ref={textRef}
              className="z-50 w-full text-center text-[8vw] font-light"
              style={
                {
                  '--gradient-from': '#A6D3B6',
                  '--gradient-to': '#9DFFC4',
                  background:
                    'linear-gradient(90deg, var(--gradient-from) 0%, var(--gradient-to) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mixBlendMode: 'difference',
                  lineHeight: '1',
                } as React.CSSProperties
              }
            >
              Explore our services
            </div>
            <div className="z-50 flex w-full justify-center text-primary" ref={iconRef}>
              <ArrowRightIcon className="h-8 w-8 lg:h-14 lg:w-14" />
            </div>
          </Link>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url("/images/pre-footer-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      </div>
    </section>
  );
}
