'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Newsletter from '../ui/forms/newsletter';
import PreFooter from './pre-footer';
// Define the logo interface
interface Logo {
  asset: {
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
}

interface FooterClientProps {
  logo: Logo | null;
}

const navItems = [
  {
    label: 'Home',
    href: '/',
    target: false,
  },
  {
    label: 'Blog',
    href: '/blog',
    target: false,
  },
  {
    label: 'About',
    href: '/about',
    target: false,
  },
];

const legalItems = [
  {
    label: 'Privacy Policy',
    href: '/privacy',
    target: false,
  },
  {
    label: 'Terms of Service',
    href: '/terms',
    target: false,
  },
  {
    label: 'Cookie Policy',
    href: '/cookie',
    target: false,
  },
];

export default function FooterClient({ logo }: FooterClientProps) {
  const pathname = usePathname();

  // Hide footer on homepage and experience pages
  if (pathname === '/' || pathname === '/experience' || pathname?.startsWith('/experience/')) {
    return null;
  }

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
                {logo ? (
                  <Image
                    src={logo.asset.url}
                    alt={logo.alt || 'Logo'}
                    width={logo.asset.metadata.dimensions.width}
                    height={logo.asset.metadata.dimensions.height}
                    className="h-auto w-full"
                  />
                ) : null}
              </Link>
              <div className="flex w-full flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
                {navItems.map(navItem => (
                  <Link
                    key={navItem.label}
                    href={navItem.href}
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
              {legalItems.map(legalItem => (
                <Link
                  key={legalItem.label}
                  href={legalItem.href}
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
