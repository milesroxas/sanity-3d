'use client';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import SocialLinks from '@/components/ui/social-links';
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { urlFor } from '@/sanity/lib/image';
import { AlignRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LinkButton } from '../shared/link-button';
import { useStore } from '@/lib/store';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const setIsNavOpened = useStore(state => state.setIsNavOpened);

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

  // Lock background scroll while open, without breaking inner scroll
  useEffect(() => {
    if (!open) return;
    const previous = {
      bodyOverflow: document.body.style.overflow,
      bodyOverscroll: (document.body.style as any).overscrollBehaviorY,
    };
    document.body.style.overflow = 'hidden';
    (document.body.style as any).overscrollBehaviorY = 'none';

    return () => {
      document.body.style.overflow = previous.bodyOverflow;
      (document.body.style as any).overscrollBehaviorY = previous.bodyOverscroll || '';
    };
  }, [open]);

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

  // Let global Lenis provider know nav open state, so it can stop/start smoothly
  useEffect(() => {
    setIsNavOpened(open);
  }, [open, setIsNavOpened]);

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
        className="flex h-dvh max-h-dvh flex-col overflow-hidden border-none bg-background/90 text-foreground backdrop-blur-xl px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] data-[state=open]:duration-1000 data-[state=closed]:duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
      >
        <SheetHeader className="text-right">
          <div className="ml-auto mr-6">
            {nav.logo?.asset?._id && (
              <Image
                src={urlFor(nav.logo.asset).url()}
                alt={nav.logo.alt || ''}
                width={80}
                height={80}
                className="w-[80%]"
              />
            )}
          </div>
          <div className="sr-only">
            <SheetTitle>Main Navigation</SheetTitle>
            <SheetDescription>Navigate to the website pages</SheetDescription>
          </div>
        </SheetHeader>
        {/* Scrollable content area */}
        <div
          ref={scrollRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className={`flex min-h-0 flex-1 flex-col gap-8 pb-36 pt-6 overflow-y-auto overscroll-y-contain touch-pan-y transition-opacity transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            contentReady ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="container">
            {/* Company Links */}
            <div className="mb-8">
              <h3 className="mb-3 text-right text-sm font-medium uppercase text-slate-400">
                Company
              </h3>
              <ul className="list-none space-y-3 text-right">
                {nav.companyLinks.map((navItem, index) => {
                  const link = getLink(navItem);
                  return (
                    <li key={`mobile-nav-${index}-${link.label}`}>
                      <Link
                        onClick={() => setOpen(false)}
                        href={link.href}
                        target={link.target ? '_blank' : undefined}
                        rel={link.target ? 'noopener noreferrer' : undefined}
                        className="text-xl font-light tracking-wide transition-opacity hover:opacity-60"
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
                <h3 className="mb-3 text-right text-sm font-medium uppercase text-slate-400">
                  Services
                </h3>
                <ul className="list-none space-y-3 text-right">
                  {nav.services.map((service, index) => {
                    const link = getLink(service);
                    return (
                      <li key={`mobile-service-${index}-${link.label}`}>
                        <Link
                          onClick={() => setOpen(false)}
                          href={link.href}
                          target={link.target ? '_blank' : undefined}
                          rel={link.target ? 'noopener noreferrer' : undefined}
                          className="text-xl font-light tracking-wide transition-opacity hover:opacity-60"
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
                className="group flex flex-col items-end"
              >
                <h3 className="mb-3 text-right text-lg font-medium uppercase">View Experience</h3>
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
              <div className="mb-6 text-right">
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
            <div className="mb-6 text-right">
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
              <div className="mt-8 flex justify-end">
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
          className={`absolute inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-opacity duration-500 ${
            contentReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
