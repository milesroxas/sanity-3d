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
import { urlFor } from '@/sanity/lib/image';
import { AlignRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button aria-label="Open Menu" variant="ghost" size="lg" className="p-4">
          <AlignRight />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto border-none bg-black/50 text-white backdrop-blur-sm">
        <SheetHeader>
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
        <div className="flex flex-col gap-8 pb-20 pt-10">
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
                        className="hover:text-decoration-none text-lg hover:opacity-50"
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
                          className="hover:text-decoration-none text-lg hover:opacity-50"
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
                onClick={() => setOpen(false)}
                className="group flex flex-col items-end"
              >
                <h3 className="mb-3 text-right text-lg font-medium uppercase">View Experience</h3>
                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                  <Image
                    src="/images/fpo-nav.jpg"
                    alt="experience preview"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                <SocialLinks social={settings.social} iconClassName="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
