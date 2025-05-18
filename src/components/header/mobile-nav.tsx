'use client';
import Logo from '@/components/logo';
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
import { TextAlignRightIcon } from '@radix-ui/react-icons';
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
        href: `/${link.page.slug}`,
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
        <Button
          aria-label="Open Menu"
          variant="ghost"
          className="w-[1.75rem] p-5 focus-visible:ring-1 focus-visible:ring-offset-1"
        >
          <TextAlignRightIcon className={isExperiencePage ? 'text-white' : 'dark:text-white'} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="ml-auto mr-6">
            <Logo />
          </div>
          <div className="sr-only">
            <SheetTitle>Main Navigation</SheetTitle>
            <SheetDescription>Navigate to the website pages</SheetDescription>
          </div>
        </SheetHeader>
        <div className="pb-20 pt-10">
          <div className="container">
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
