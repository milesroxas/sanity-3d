'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { LinkButton } from '../shared/link-button';

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
      <div
        className="w-full pb-80"
        style={{
          backgroundImage: 'url("/images/footer-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: '0% 50%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container relative z-20 flex flex-col gap-12 pb-24">
          <div className="items-center justify-between gap-6 lg:flex-row">
            <p className="mx-auto text-center text-lg font-light leading-relaxed text-white md:text-xl lg:w-[75%] xl:text-3xl">
              Request your personalized security proposal from our family‑owned local leaders who've
              been safeguarding communities for 40 years.
            </p>
          </div>
          <div className="mx-auto grid max-w-prose grid-cols-1 gap-2 lg:w-auto lg:grid-cols-2">
            <LinkButton
              link={{
                _type: 'customLink',
                _key: 'prefooter-request-proposal',
                title: 'Request a Proposal',
                href: '/contact',
                target: false,
                buttonVariant: 'default',
              }}
              className="w-full whitespace-normal py-4"
            />
            <LinkButton
              link={{
                _type: 'customLink',
                _key: 'prefooter-experience',
                title: 'Enter Experience',
                href: '/experience',
                target: false,
                buttonVariant: 'ghost',
              }}
              className="w-full whitespace-normal py-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
