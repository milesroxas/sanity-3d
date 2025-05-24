'use client';

import DesktopNav from '@/components/header/desktop-nav';
import MobileNav from '@/components/header/mobile-nav';
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useSceneStore } from '@/experience/scenes/store/sceneStore';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(useGSAP);

interface SanityLogo {
  asset: any;
  alt?: string;
}
interface SanityNav {
  logo: SanityLogo;
  companyLinks: any[];
  services: any[] | null;
  legal: any[] | null;
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

  const headerRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isTransitioning } = useSceneStore();
  const { isAnimating, isLoading } = useCameraStore();
  const { isContentVisible, otherMarkersVisible } = useLogoMarkerStore();

  // only animate nav on /experience routes
  const isExperiencePage = pathname === '/experience' || pathname.startsWith('/experience/');
  const isLandingPage = pathname === '/';

  // GSAP header scroll-hide/show (unchanged)
  const { contextSafe } = useGSAP(
    () => {
      if (!headerRef.current) return;
      const y = window.scrollY;
      if (y <= 50) {
        gsap.set(headerRef.current, { opacity: 1 });
        headerRef.current.style.pointerEvents = 'auto';
      } else {
        gsap.set(headerRef.current, { opacity: 0 });
        headerRef.current.style.pointerEvents = 'none';
        gsap.to(headerRef.current, {
          opacity: 1,
          duration: 0.3,
          delay: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            headerRef.current!.style.pointerEvents = 'auto';
          },
        });
      }
      lastScrollYRef.current = Math.max(0, y);
    },
    { scope: headerRef, dependencies: [pathname] }
  );

  const showHeader = contextSafe(() => {
    if (!headerRef.current) return;
    gsap.to(headerRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        headerRef.current!.style.pointerEvents = 'auto';
      },
    });
  });
  const hideHeader = contextSafe(() => {
    if (!headerRef.current) return;
    gsap.to(headerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        headerRef.current!.style.pointerEvents = 'none';
      },
    });
  });

  const onScroll = contextSafe(() => {
    if (isExperiencePage) return;
    const y = window.scrollY;
    const TH = 50;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (y > lastScrollYRef.current && y > TH) hideHeader();
    else showHeader();

    lastScrollYRef.current = Math.max(0, y);

    scrollTimeoutRef.current = setTimeout(() => {
      if (!headerRef.current) return;
      const o = gsap.getProperty(headerRef.current, 'opacity') as number;
      if ((y > 0 && o < 0.1) || y <= TH) showHeader();
    }, 2000);
  });

  useEffect(() => {
    if (!isExperiencePage) {
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }
  }, [onScroll, isExperiencePage]);

  // GSAP nav fade (experience only)
  const showNav = contextSafe(() => {
    if (!navContainerRef.current) return;
    gsap.to(navContainerRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onStart: () => {
        navContainerRef.current!.style.pointerEvents = 'auto';
      },
    });
  });
  const hideNav = contextSafe(() => {
    if (!navContainerRef.current) return;
    gsap.to(navContainerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        navContainerRef.current!.style.pointerEvents = 'none';
      },
    });
  });

  // Set initial states on mount
  useEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0 });
      headerRef.current.style.pointerEvents = 'none';
    }
    if (navContainerRef.current) {
      gsap.set(navContainerRef.current, { opacity: 0 });
      navContainerRef.current.style.pointerEvents = 'none';
    }

    // Show header immediately on non-experience pages
    if (!isExperiencePage) {
      showHeader();
      showNav();
    }
  }, []);

  // whenever route enters /experience hide immediately
  useEffect(() => {
    if (isExperiencePage) {
      hideNav();
    } else {
      showNav();
      showHeader();
    }
  }, [isExperiencePage]);

  // Match the logo markers visibility - when they're visible, show the header
  // when they're hidden (during transitions or content drawer), hide the header
  useEffect(() => {
    if (!isExperiencePage) return;

    if (
      otherMarkersVisible &&
      !isContentVisible &&
      !isAnimating &&
      !isLoading &&
      !isTransitioning
    ) {
      showHeader();
      showNav();
    } else {
      hideHeader();
      hideNav();
    }
  }, [
    otherMarkersVisible,
    isContentVisible,
    isAnimating,
    isLoading,
    isTransitioning,
    isExperiencePage,
  ]);

  return (
    <header ref={headerRef} className="fixed top-0 z-50 w-full border-border/40 py-2">
      <div className="container relative flex h-14 items-center">
        {!isLandingPage && !isExperiencePage && (
          <Link
            href="/"
            aria-label="Home page"
            className="absolute left-1/2 top-1/2 w-12 -translate-x-1/2 -translate-y-1/2"
          >
            {logo?.asset?._id && (
              <Image
                src={urlFor(logo.asset).url()}
                alt={logo.alt || ''}
                width={logo.asset.metadata.dimensions.width}
                height={logo.asset.metadata.dimensions.height}
                placeholder={logo.asset.metadata.lqip ? 'blur' : undefined}
                blurDataURL={logo.asset.metadata.lqip}
                quality={100}
              />
            )}
          </Link>
        )}

        <div className="ml-auto flex items-center">
          <div ref={navContainerRef} className="flex items-center gap-7">
            <div className="hidden xl:flex">
              <DesktopNav nav={nav} isExperiencePage={isExperiencePage} settings={settings} />
            </div>
            <div className="xl:hidden">
              <MobileNav nav={nav} isExperiencePage={isExperiencePage} settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
