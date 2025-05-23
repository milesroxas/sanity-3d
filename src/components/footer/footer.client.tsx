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

    // For legalLink type with legal reference
    if (link._type === 'legalLink' && link.legal?.slug) {
      return {
        label: link.title || '',
        href: `/${link.legal.slug}`,
        target: false,
      };
    }

    // For servicesLink type with services reference
    if (link._type === 'servicesLink' && link.services?.slug) {
      return {
        label: link.title || '',
        href: `/${link.services.slug}`,
        target: false,
      };
    }

    // For service link type (fallback for older structure)
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

    // Fallback - if we have a title but no valid link, still show it for debugging
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
      <div className="overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-zinc-900 text-white md:rounded-tl-[20px] md:rounded-tr-[20px] lg:rounded-tl-[50px] lg:rounded-tr-[50px]">
        <PreFooter />
        <div className="container px-4 py-8 md:py-12">
          {/* Main footer content */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
              {/* Logo section */}
              <div className="lg:col-span-3">
                <Link
                  className="inline-block w-12 md:w-16"
                  href="/experience"
                  aria-label="Home page"
                >
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
              </div>

              {/* Company links */}
              {companyLinks.length > 0 && (
                <div className="space-y-3 lg:col-span-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                    Company
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm lg:flex-col lg:gap-x-0 lg:gap-y-3">
                    {companyLinks.map((navItem, index) => (
                      <Link
                        key={`company-${navItem.label}-${index}`}
                        href={navItem.href || '#'}
                        target={navItem.target ? '_blank' : undefined}
                        rel={navItem.target ? 'noopener noreferrer' : undefined}
                        className="text-zinc-400 transition-colors hover:text-white"
                      >
                        {navItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Services links */}
              {servicesLinks.length > 0 && (
                <div className="space-y-3 lg:col-span-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                    Services
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm lg:flex-col lg:gap-x-0 lg:gap-y-3">
                    {servicesLinks.map((navItem, index) => (
                      <Link
                        key={`services-${navItem.label}-${index}`}
                        href={navItem.href || '#'}
                        target={navItem.target ? '_blank' : undefined}
                        rel={navItem.target ? 'noopener noreferrer' : undefined}
                        className="text-zinc-400 transition-colors hover:text-white"
                      >
                        {navItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter section */}
              <div className="lg:col-span-5">
                <div className="">
                  <Newsletter
                    colorVariant="transparent"
                    buttonText="Subscribe"
                    successMessage="You've been subscribed to our newsletter."
                    inputClassName="w-full bg-zinc-800 border-zinc-700 placeholder:text-zinc-400"
                    className="w-full p-0"
                  />
                </div>
              </div>
            </div>

            {/* Social links - aligned with newsletter end on desktop */}
            {settings?.social && (
              <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
                <div className="lg:col-span-6 lg:col-start-7">
                  <div className="lg:ml-auto lg:max-w-md">
                    <div className="flex justify-start lg:justify-end">
                      <SocialLinks social={settings.social} className="flex gap-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Copyright and legal section */}
          <div className="mt-8 flex flex-col gap-4 border-t border-zinc-800 pt-6 text-xs text-zinc-400 md:flex-row md:items-center md:justify-between md:gap-6">
            {/* Copyright */}
            <div>
              <p>&copy; O'Linn Security Inc. {getCurrentYear()}.</p>
            </div>

            {/* Legal links */}
            {legalLinks.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2">
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
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
