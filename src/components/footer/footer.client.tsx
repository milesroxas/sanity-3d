'use client';

import SocialLinks from '@/components/ui/social-links';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FooterNewsletter from '../ui/forms/footer-newsletter';
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
        <div className="container px-4 pt-8 md:pt-12">
          {/* Main footer content */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
              {/* Logo section */}
              <div className="lg:col-span-1">
                <Link className="inline-block w-12 md:w-16" href="/" aria-label="Home page">
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

              <div className="flex flex-row items-start gap-8 align-top lg:col-span-7 lg:flex-col">
                {companyLinks.length > 0 && (
                  <div className="flex flex-col flex-wrap gap-x-4 gap-y-2 lg:flex-row lg:gap-y-2">
                    {companyLinks.map((navItem, index) => (
                      <Link
                        key={`company-${navItem.label}-${index}`}
                        href={navItem.href || '#'}
                        target={navItem.target ? '_blank' : undefined}
                        rel={navItem.target ? 'noopener noreferrer' : undefined}
                        className="text-xs text-zinc-400 transition-colors hover:text-green-400"
                      >
                        {navItem.label}
                      </Link>
                    ))}
                  </div>
                )}

                {servicesLinks.length > 0 && (
                  <div className="lg:col-span-6">
                    <div className="flex flex-col flex-wrap gap-x-4 gap-y-2 lg:flex-row lg:gap-y-2">
                      {servicesLinks.map((navItem, index) => (
                        <Link
                          key={`services-${navItem.label}-${index}`}
                          href={navItem.href || '#'}
                          target={navItem.target ? '_blank' : undefined}
                          rel={navItem.target ? 'noopener noreferrer' : undefined}
                          className="text-xs text-zinc-400 transition-colors hover:text-green-400"
                        >
                          {navItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Newsletter section */}
              <div className="flex flex-col gap-8 lg:col-span-4 lg:items-end lg:gap-4">
                <FooterNewsletter
                  colorVariant="transparent"
                  buttonText="Subscribe"
                  successMessage="You've been subscribed to our newsletter."
                  inputClassName="w-full bg-zinc-800 border-zinc-700 placeholder:text-zinc-400"
                  className="w-full p-0"
                />
                {/* Social links - aligned with newsletter end on desktop */}
                {settings?.social && (
                  <div className="flex justify-start lg:justify-end">
                    <SocialLinks social={settings.social} className="flex gap-4" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Copyright and legal section */}
          <div className="mt-8 flex flex-row gap-4 border-t border-zinc-800 py-6 text-xs text-zinc-400 md:flex-row md:items-center md:justify-between md:gap-6">
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
                    className="transition-colors hover:text-green-400"
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
