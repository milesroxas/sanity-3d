'use client';

import DesktopNav from '@/components/header/desktop-nav';
import MobileNav from '@/components/header/mobile-nav';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { urlFor } from '@/sanity/lib/image';
import { useNavigationStore, type SanityNav, type SanitySettings } from '@/store/navStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HeaderProps {
  nav: SanityNav;
  settings: SanitySettings;
}

export default function Header({ nav, settings }: HeaderProps) {
  const pathname = usePathname();
  const logo = nav.logo;

  const headerRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // External stores
  const { otherMarkersVisible, setSelectedScene } = useLogoMarkerStore();

  // Navigation store
  const { setHeaderVisible, setNavVisible, setExperiencePage, closeMenu } = useNavigationStore();

  const isExperiencePage = pathname === '/experience' || pathname.startsWith('/experience/');
  const isLandingPage = pathname === '/';

  // Update experience page state when pathname changes
  useEffect(() => {
    setExperiencePage(isExperiencePage);
    closeMenu();

    // Reset selected scene when navigating to the main experience page
    if (pathname === '/experience') {
      setSelectedScene(null);
    }
  }, [isExperiencePage, pathname, setExperiencePage, setSelectedScene]);

  // GSAP animation functions
  const { contextSafe } = useGSAP(() => {
    if (!headerRef.current || !navContainerRef.current) return;

    if (!isExperiencePage) {
      gsap.killTweensOf([headerRef.current, navContainerRef.current]);
      gsap.set([headerRef.current, navContainerRef.current], {
        opacity: 1,
        pointerEvents: 'auto',
      });

      setHeaderVisible(true);
      setNavVisible(true);
    }
  }, [isExperiencePage, setHeaderVisible, setNavVisible]);

  const showHeader = contextSafe(
    useCallback(() => {
      if (!headerRef.current) return;

      gsap.to(headerRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          headerRef.current!.style.pointerEvents = 'auto';
        },
        onComplete: () => {
          setHeaderVisible(true);
        },
      });
    }, [setHeaderVisible])
  );

  const hideHeader = contextSafe(
    useCallback(() => {
      if (!headerRef.current) return;

      gsap.to(headerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          headerRef.current!.style.pointerEvents = 'none';
          setHeaderVisible(false);
        },
      });
    }, [setHeaderVisible])
  );

  const showNav = contextSafe(
    useCallback(() => {
      if (!navContainerRef.current) return;

      gsap.to(navContainerRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          navContainerRef.current!.style.pointerEvents = 'auto';
        },
        onComplete: () => {
          setNavVisible(true);
        },
      });

      // Ensure main content is also clickable
      gsap.set('main', { pointerEvents: 'auto' });
    }, [setNavVisible])
  );

  const hideNav = contextSafe(
    useCallback(() => {
      if (!navContainerRef.current) return;

      gsap.to(navContainerRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          navContainerRef.current!.style.pointerEvents = 'none';
          setNavVisible(false);
        },
      });
    }, [setNavVisible])
  );

  useEffect(() => {
    if (!isExperiencePage) return;

    if (otherMarkersVisible) {
      showHeader();
      showNav();
    } else {
      hideHeader();
      hideNav();
    }
  }, [otherMarkersVisible, isExperiencePage, showHeader, showNav, hideHeader, hideNav]);

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
              <DesktopNav nav={nav} settings={settings} />
            </div>
            <div className="xl:hidden">
              <MobileNav nav={nav} settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
