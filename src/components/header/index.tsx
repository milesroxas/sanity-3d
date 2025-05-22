'use client';

import DesktopNav from '@/components/header/desktop-nav';
import ExperienceNav from '@/components/header/experience-nav';
import MobileNav from '@/components/header/mobile-nav';
import { useSceneStore } from '@/experience/scenes/store/sceneStore';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Register the useGSAP hook
gsap.registerPlugin(useGSAP);

interface SanityLogo {
  asset: any;
  alt?: string;
}

interface SanityNav {
  logo: SanityLogo;
  companyLinks: Array<any>;
  services: Array<any> | null;
  legal: Array<any> | null;
}

interface SanitySettings {
  contact: {
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  businessHours: {
    hours: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    yelp: string;
    tiktok: string;
    googleReviews: string;
  };
}

interface HeaderProps {
  nav: SanityNav;
  settings: SanitySettings;
}

export default function Header({ nav, settings }: HeaderProps) {
  const pathname = usePathname();
  const logo = nav.logo;

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const experienceNavTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scene store and state
  const { isTransitioning, isInitialReveal } = useSceneStore();
  const [experienceNavVisible, setExperienceNavVisible] = useState(false);

  const isExperiencePage =
    pathname === '/' || pathname === '/experience' || pathname?.startsWith('/experience/');

  // Main GSAP setup with automatic cleanup
  const { contextSafe } = useGSAP(
    () => {
      if (!headerRef.current) return;

      // Initial setup based on page type and scroll position
      if (isExperiencePage) {
        // Hide header for experience pages
        gsap.set(headerRef.current, { opacity: 0 });
        headerRef.current.style.pointerEvents = 'none';
      } else {
        // Setup for regular pages
        const initialScrollY = window.scrollY;

        if (initialScrollY <= 50) {
          gsap.set(headerRef.current, { opacity: 1 });
          headerRef.current.style.pointerEvents = 'auto';
        } else {
          gsap.set(headerRef.current, { opacity: 0 });
          headerRef.current.style.pointerEvents = 'none';

          // Show after brief delay when loaded scrolled down
          gsap.to(headerRef.current, {
            opacity: 1,
            duration: 0.3,
            delay: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              if (headerRef.current) {
                headerRef.current.style.pointerEvents = 'auto';
              }
            },
          });
        }

        lastScrollYRef.current = Math.max(0, initialScrollY);
      }
    },
    {
      scope: headerRef,
      dependencies: [isExperiencePage],
    }
  );

  // Context-safe animation functions for scroll interactions
  const showHeader = contextSafe((duration = 0.3) => {
    if (!headerRef.current) return;

    gsap.to(headerRef.current, {
      opacity: 1,
      duration,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        if (headerRef.current) {
          headerRef.current.style.pointerEvents = 'auto';
        }
      },
    });
  });

  const hideHeader = contextSafe((duration = 0.3) => {
    if (!headerRef.current) return;

    gsap.to(headerRef.current, {
      opacity: 0,
      duration,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        if (headerRef.current) {
          headerRef.current.style.pointerEvents = 'none';
        }
      },
    });
  });

  // Context-safe scroll handler
  const handleScroll = contextSafe(() => {
    if (isExperiencePage) return;

    const currentScrollY = window.scrollY;
    const scrollThreshold = 50;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Handle scroll direction
    if (currentScrollY > lastScrollYRef.current && currentScrollY > scrollThreshold) {
      hideHeader();
    } else if (currentScrollY < lastScrollYRef.current || currentScrollY <= scrollThreshold) {
      showHeader();
    }

    lastScrollYRef.current = Math.max(0, currentScrollY);

    // Show header after scroll stops
    scrollTimeoutRef.current = setTimeout(() => {
      if (!headerRef.current) return;

      const currentOpacity = gsap.getProperty(headerRef.current, 'opacity') as number;
      if (currentScrollY > 0 && currentOpacity < 0.1) {
        showHeader();
      } else if (currentScrollY <= scrollThreshold) {
        showHeader();
      }
    }, 2000);
  });

  // Experience nav visibility logic
  useEffect(() => {
    if (!isExperiencePage) {
      setExperienceNavVisible(false);
      return;
    }

    if (!isInitialReveal && !isTransitioning && !experienceNavVisible) {
      experienceNavTimerRef.current = setTimeout(() => {
        setExperienceNavVisible(true);
      }, 500);
    }

    if (isInitialReveal || isTransitioning) {
      setExperienceNavVisible(false);
      if (experienceNavTimerRef.current) {
        clearTimeout(experienceNavTimerRef.current);
        experienceNavTimerRef.current = null;
      }
    }

    return () => {
      if (experienceNavTimerRef.current) {
        clearTimeout(experienceNavTimerRef.current);
        experienceNavTimerRef.current = null;
      }
    };
  }, [isInitialReveal, isTransitioning, experienceNavVisible, isExperiencePage]);

  // Scroll event listener setup for non-experience pages
  useEffect(() => {
    if (isExperiencePage) return;

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [isExperiencePage, handleScroll]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (experienceNavTimerRef.current) {
        clearTimeout(experienceNavTimerRef.current);
      }
    };
  }, []);

  // Render experience nav for experience pages
  if (isExperiencePage) {
    return <ExperienceNav visible={experienceNavVisible} />;
  }

  // Render main header for other pages
  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full border-border/40 py-2"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <div className="container relative flex h-14 items-center">
        <Link
          href="/"
          aria-label="Home page"
          className="absolute left-1/2 top-1/2 w-12 -translate-x-1/2 -translate-y-1/2"
        >
          {logo?.asset?._id && (
            <Image
              src={urlFor(logo.asset).url()}
              alt={logo.alt || ''}
              width={logo.asset?.metadata?.dimensions?.width || 800}
              height={logo.asset?.metadata?.dimensions?.height || 800}
              placeholder={logo?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={logo?.asset?.metadata?.lqip || ''}
              quality={100}
            />
          )}
        </Link>

        <div className="ml-auto flex items-center">
          <div className="hidden items-center justify-between gap-7 xl:flex">
            <DesktopNav nav={nav} isExperiencePage={false} settings={settings} />
          </div>
          <div className="flex items-center xl:hidden">
            <MobileNav nav={nav} isExperiencePage={false} settings={settings} />
          </div>
        </div>
      </div>
    </header>
  );
}
