'use client';

import { fetchSanitySettings } from '@/app/(main)/actions';
import DesktopNav from '@/components/header/desktop-nav';
import ExperienceNav from '@/components/header/experience-nav';
import MobileNav from '@/components/header/mobile-nav';
import { useSceneStore } from '@/experience/scenes/store/sceneStore';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navItems = [
  {
    label: 'Services',
    href: '/services',
    target: false,
  },
  {
    label: 'About Us',
    href: '/about',
    target: false,
  },
  {
    label: 'Testimonials',
    href: '/testimonials',
    target: false,
  },
  {
    label: 'News',
    href: '/news',
    target: false,
  },
];

export default function Header() {
  const pathname = usePathname();
  const [logo, setLogo] = useState<any>(null);
  const [navVisible, setNavVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    const fetchLogo = async () => {
      const settings = await fetchSanitySettings();
      setLogo(settings.logo);
    };
    fetchLogo();
  }, []);

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
          <DesktopNav navItems={navItems} isExperiencePage={false} />
          {/* <ModeToggle /> */}
        </div>
        <div className="flex items-center xl:hidden">
          {/* <ModeToggle /> */}
          <MobileNav navItems={navItems} isExperiencePage={false} />
        </div>
      </div>
    </header>
  );
}
