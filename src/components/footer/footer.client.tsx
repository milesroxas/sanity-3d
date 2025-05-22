'use client';

import SocialLinks from '@/components/ui/social-links';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Newsletter from '../ui/forms/newsletter';
import PreFooter from './pre-footer';

// Define the Sanity logo interface
interface SanityLogo {
  asset: any; // Sanity asset reference
  alt?: string;
}

// Define the Sanity nav interface
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

interface FooterClientProps {
  nav: SanityNav | null;
  settings?: SanitySettings;
}

export default function FooterClient({ nav, settings }: FooterClientProps) {
  const pathname = usePathname();

  // Hide footer on homepage and experience pages
  if (pathname === '/' || pathname === '/experience' || pathname?.startsWith('/experience/')) {
    return null;
  }

  // Helper function to get link data
  const getLink = (link: any) => {
    if (!link) return { label: '', href: '#', target: false };

    // For pageLink type with page reference
    if (link._type === 'pageLink' && link.page?.slug) {
      return {
        label: link.title || '',
        href: `/${link.page.slug}`,
        target: false,
      };
    }

    // For service link type
    if (link.services?.slug) {
      return {
        label: link.title || '',
        href: `/${link.services.slug}`,
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

  const companyLinks = (nav?.companyLinks || []).map(getLink);
  const servicesLinks = (nav?.services || []).map(getLink);
  const legalLinks = (nav?.legal || []).map(getLink);

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className="bg-muted">
      <div className="overflow-hidden rounded-tl-[50px] rounded-tr-[50px] bg-zinc-900 text-white sm:rounded-tl-[10px] sm:rounded-tr-[10px] md:rounded-tl-[20px] md:rounded-tr-[20px] lg:rounded-tl-[50px] lg:rounded-tr-[50px]">
        <PreFooter />
        <div className="container px-4 py-6">
          {/* Main footer section with logo left and nav right */}
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            {/* Logo on the left */}
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <Link className="block w-[6.25rem]" href="/" aria-label="Home page">
                {nav?.logo ? (
                  <Image
                    src={urlFor(nav.logo.asset).url()}
                    alt={nav.logo.alt || 'Logo'}
                    width={nav.logo.asset.metadata.dimensions.width}
                    height={nav.logo.asset.metadata.dimensions.height}
                    className="h-auto w-full"
                  />
                ) : null}
              </Link>
              <div className="flex w-full flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
                {companyLinks.map((navItem, index) => (
                  <Link
                    key={`company-${navItem.label}-${index}`}
                    href={navItem.href || '#'}
                    target={navItem.target ? '_blank' : undefined}
                    rel={navItem.target ? 'noopener noreferrer' : undefined}
                    className="transition-colors hover:text-zinc-300"
                  >
                    {navItem.label}
                  </Link>
                ))}
                {servicesLinks.map((navItem, index) => (
                  <Link
                    key={`services-${navItem.label}-${index}`}
                    href={navItem.href || '#'}
                    target={navItem.target ? '_blank' : undefined}
                    rel={navItem.target ? 'noopener noreferrer' : undefined}
                    className="transition-colors hover:text-zinc-300"
                  >
                    {navItem.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center gap-7 md:w-auto">
              <Newsletter
                colorVariant="transparent"
                buttonText="Subscribe"
                successMessage="You've been subscribed to our newsletter."
                inputClassName="w-full bg-zinc-800 border-zinc-700 placeholder:text-zinc-400"
                className="w-full"
              />
              {settings?.social && (
                <SocialLinks
                  social={settings.social}
                  className="flex w-full justify-center gap-4"
                />
              )}
            </div>
          </div>

          {/* Copyright section */}
          <div className="mt-8 flex flex-col justify-between border-t border-zinc-800 pt-6 text-center text-xs text-zinc-400 md:flex-row">
            <div className="w-auto">
              <p>&copy; O'Linn Security Inc. {getCurrentYear()}.</p>
            </div>
            <div className="flex w-auto flex-col items-center justify-between space-y-6 md:flex-row md:gap-4 md:space-y-0">
              {legalLinks.map((legalItem, index) => (
                <Link
                  key={`legal-${legalItem.label}-${index}`}
                  href={legalItem.href || '#'}
                  target={legalItem.target ? '_blank' : undefined}
                  rel={legalItem.target ? 'noopener noreferrer' : undefined}
                  className="transition-colors hover:text-zinc-300"
                >
                  {legalItem.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
