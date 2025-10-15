'use client';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import SocialLinks from '@/components/ui/social-links';
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useOverlayScrollLock } from '@/hooks/useOverlayScrollLock';
import { urlFor } from '@/sanity/lib/image';
import { AlignRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { LinkButton } from '../shared/link-button';

interface SanityLogo {
  asset: any; // Sanity asset reference
  alt?: string;
}
interface SanityNav {
  logo: SanityLogo;
  companyLinks: Array<any>; // Array of Sanity references or objects
  services: Array<any> | null;
  legal: Array<any> | null;
}

interface SanitySettings {
  contact?: {
    phone?: string;
    email?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  businessHours?: {
    hours?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    yelp?: string;
    tiktok?: string;
    googleReviews?: string;
  };
}

export default function MobileNav({
  nav,
  isExperiencePage,
  settings,
}: {
  nav: SanityNav;
  isExperiencePage?: boolean;
  settings?: SanitySettings;
}) {
  const [open, setOpen] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const pathname = usePathname();
  const { scrollAreaProps } = useOverlayScrollLock(open, {
    lockBody: true,
    overscrollBehaviorY: 'none',
    preventLenis: true,
    stopWheelPropagation: true,
    webkitMomentumScroll: true,
  });
  const { className: overlayClassName, ...overlayProps } = scrollAreaProps;

  // Reset experience stores
  const resetCameraStore = useCameraStore(state => state.reset);
  const resetLogoMarkerStore = useLogoMarkerStore(state => state.reset);

  // Handle experience link click
  const handleExperienceClick = useCallback(() => {
    // Reset all experience-related states

    resetCameraStore();
    resetLogoMarkerStore();
    setOpen(false);
  }, [resetCameraStore, resetLogoMarkerStore]);

  // Helper function to get link data
  const getLink = (link: any) => {
    if (!link) return { label: '', href: '#', target: false };

    // For pageLink type with page reference
    if (link._type === 'pageLink' && link.page?.slug) {
      return {
        label: link.title || '',
        href: `/${link.page.slug.current || link.page.slug}`,
        target: false,
      };
    }

    // For service link type
    if (link._type === 'servicesLink') {
      // More resilient handling
      const slug =
        link.services?.slug?.current ||
        (typeof link.services?.slug === 'string' ? link.services.slug : '');
      return {
        label: link.title || '',
        href: slug ? `/services/${slug}` : '/services',
        target: false,
      };
    }

    // For external links
    if (link.url) {
      return {
        label: link.title || '',
        href: link.url,
        target: link.openInNewTab || false,
      };
    }

    // Fallback
    return {
      label: link.title || '',
      href: '#',
      target: false,
    };
  };

  // Body lock + Lenis handled by useOverlayScrollLock

  // Defer content reveal until after the panel mostly slides in
  useEffect(() => {
    let timer: number | undefined;
    if (open) {
      setContentReady(false);
      timer = window.setTimeout(() => setContentReady(true), 700); // match majority of open animation
    } else {
      setContentReady(false);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [open]);

  // Global scroll lock handled by useOverlayScrollLock

  // Rely on CSS overscroll behavior and body lock; avoid JS preventing default which can block scrolling

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button aria-label="Open Menu" variant="ghost" size="lg" className="p-4">
          <AlignRight />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-dvh max-h-dvh flex-col overflow-hidden border-none bg-background/90 px-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-foreground backdrop-blur-xl will-change-transform [animation-timing-function:cubic-bezier(0.2,0.8,0.2,1)] [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] data-[state=closed]:duration-700 data-[state=open]:duration-1000 sm:px-6"
      >
        <SheetHeader className="flex-row items-center justify-between space-y-0">
          <div className="py-4">
            {nav.logo?.asset?._id && (
              <Image
                src={urlFor(nav.logo.asset).url()}
                alt={nav.logo.alt || ''}
                width={40}
                height={40}
              />
            )}
          </div>
          <SheetClose asChild>
            <Button aria-label="Close Menu" variant="ghost" size="lg" className="p-4">
              <X className="h-6 w-6" />
            </Button>
          </SheetClose>
          <div className="sr-only">
            <SheetTitle>Main Navigation</SheetTitle>
            <SheetDescription>Navigate to the website pages</SheetDescription>
          </div>
        </SheetHeader>
        {/* Scrollable content area */}
        <div
          className={`flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto pb-36 pt-6 transition-opacity transition-transform duration-500 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] ${
            contentReady ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
          } ${overlayClassName || ''}`}
          {...overlayProps}
        >
          <div>
            {/* Company Links */}
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-medium uppercase text-slate-400">Company</h3>
              <ul className="list-none space-y-3">
                {nav.companyLinks.map((navItem, index) => {
                  const link = getLink(navItem);
                  const isActive = pathname === link.href;

                  if (isActive) {
                    return (
                      <li key={`mobile-nav-${index}-${link.label}`}>
                        <span className="cursor-default text-lg font-light tracking-wide text-primary/50">
                          {link.label}
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={`mobile-nav-${index}-${link.label}`}>
                      <Link
                        onClick={() => setOpen(false)}
                        href={link.href}
                        target={link.target ? '_blank' : undefined}
                        rel={link.target ? 'noopener noreferrer' : undefined}
                        className="text-lg font-light tracking-wide transition-opacity hover:opacity-60"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services Links */}
            {nav.services && nav.services.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-3 text-sm font-medium uppercase text-slate-400">Services</h3>
                <ul className="list-none space-y-3">
                  {nav.services.map((service, index) => {
                    const link = getLink(service);
                    const isActive = pathname === link.href;

                    if (isActive) {
                      return (
                        <li key={`mobile-service-${index}-${link.label}`}>
                          <span className="cursor-default text-base font-light tracking-wide text-primary/50">
                            {link.label}
                          </span>
                        </li>
                      );
                    }

                    return (
                      <li key={`mobile-service-${index}-${link.label}`}>
                        <Link
                          onClick={() => setOpen(false)}
                          href={link.href}
                          target={link.target ? '_blank' : undefined}
                          rel={link.target ? 'noopener noreferrer' : undefined}
                          className="text-base font-light tracking-wide transition-opacity hover:opacity-60"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Experience Link with Image */}
            <div className="mb-8">
              <Link
                href="/experience"
                onClick={handleExperienceClick}
                className="group flex flex-col items-start"
              >
                <h3 className="mb-3 text-lg font-medium uppercase">View Experience</h3>
                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                  <Image
                    src="/images/fpo-nav.jpg"
                    alt="experience preview"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Contact Information */}
            {settings?.contact && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium uppercase text-slate-400">Contact Us</h3>
                <div className="flex flex-col gap-2">
                  {settings.contact.phone && (
                    <Link
                      href={`tel:${settings.contact.phone}`}
                      className="text-sm hover:text-primary"
                    >
                      {settings.contact.phone}
                    </Link>
                  )}
                  {settings.contact.email && (
                    <Link
                      href={`mailto:${settings.contact.email}`}
                      className="text-sm hover:text-primary"
                    >
                      {settings.contact.email}
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Address and Hours */}
            <div className="mb-6">
              {settings?.address && (
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-medium uppercase text-slate-400">Location</h3>
                  <p className="text-sm font-light">
                    {settings.address?.street && `${settings.address.street}, `}
                    {settings.address?.city && `${settings.address.city}, `}
                    {settings.address?.state && `${settings.address.state} `}
                    {settings.address?.zip && settings.address.zip}
                  </p>
                </div>
              )}

              {settings?.businessHours?.hours && (
                <div>
                  <h3 className="mb-2 text-sm font-medium uppercase text-slate-400">
                    Business Hours
                  </h3>
                  <p className="text-sm font-light">{settings.businessHours.hours}</p>
                </div>
              )}
            </div>

            {/* Social Links */}
            {settings?.social && (
              <div className="mt-8 flex justify-start">
                <SocialLinks
                  social={settings.social}
                  iconClassName="h-5 w-5 text-foreground/70 transition-colors hover:text-foreground"
                />
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom CTA */}
        <div
          className={`absolute inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 backdrop-blur transition-opacity duration-500 supports-[backdrop-filter]:bg-background/80 ${
            contentReady ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="mx-auto max-w-screen-sm">
            <LinkButton
              link={{
                _type: 'customLink',
                _key: 'mobile-nav-request-security-proposal',
                title: 'Request Security Proposal',
                href: '/contact',
                target: false,
                buttonVariant: 'default',
              }}
              onClick={() => setOpen(false)}
              className="w-full text-base"
              size="lg"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
