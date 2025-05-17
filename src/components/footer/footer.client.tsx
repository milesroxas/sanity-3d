'use client';

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

interface FooterClientProps {
  nav: SanityNav | null;
}

export default function FooterClient({ nav }: FooterClientProps) {
  const pathname = usePathname();

  // Hide footer on homepage and experience pages
  if (pathname === '/' || pathname === '/experience' || pathname?.startsWith('/experience/')) {
    return null;
  }

  // Helper function to get link data
  const getLink = (link: any) => {
    if (!link) return { label: '', href: '#', target: false };

    console.log('Processing link:', link);

    // For pageLink type
    if (link._type === 'pageLink') {
      return {
        label: link.title || '',
        href: link.page?.slug ? `/${link.page.slug}` : '#',
        target: false,
      };
    }

    // For external links
    return {
      label: link.title || '',
      href: link.url || '#',
      target: link.openInNewTab || false,
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
      <div className="overflow-hidden rounded-tl-[50px] rounded-tr-[50px] bg-zinc-900 text-white">
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
