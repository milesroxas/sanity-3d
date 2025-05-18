'use client';

import DesktopNav from '@/components/header/desktop-nav';
import ExperienceNav from '@/components/header/experience-nav';
import MobileNav from '@/components/header/mobile-nav';
import { useSceneStore } from '@/experience/scenes/store/sceneStore';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SanityLogo {
  asset: any; // Sanity asset reference
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
  const [navVisible, setNavVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const logo = nav.logo;
  const companyLinks = nav.companyLinks;
  const services = nav.services;
  const legal = nav.legal;

  // Get scene state for transition tracking
  const { isTransitioning, isInitialReveal } = useSceneStore();

  // Watch for scene state changes to control nav visibility
  useEffect(() => {
    // If transitions are complete, show nav with a short delay
    if (!isInitialReveal && !isTransitioning && !navVisible) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setNavVisible(true);
      }, 500); // Shorter delay since we're now properly tracking states
    }

    // If an animation starts, hide the nav
    if (isInitialReveal || isTransitioning) {
      setNavVisible(false);

      // Clear any pending timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isInitialReveal, isTransitioning, navVisible]);

  const isExperiencePage =
    pathname === '/' || pathname === '/experience' || pathname?.startsWith('/experience/');

  if (isExperiencePage) {
    return <ExperienceNav visible={navVisible} />;
  }

  // For all other pages
  return (
    <header className="fixed top-0 z-50 w-full border-border/40 py-2">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" aria-label="Home page" className="w-12">
          {logo && logo.asset?._id && (
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
        <div className="hidden items-center justify-between gap-7 xl:flex">
          <DesktopNav nav={nav} isExperiencePage={false} settings={settings} />
          {/* <ModeToggle /> */}
        </div>
        <div className="flex items-center xl:hidden">
          {/* <ModeToggle /> */}
          <MobileNav nav={nav} isExperiencePage={false} settings={settings} />
        </div>
      </div>
    </header>
  );
}
