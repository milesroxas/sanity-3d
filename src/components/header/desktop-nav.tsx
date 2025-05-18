'use client';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import SocialLinks from '../ui/social-links';

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
  contact: {
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  businessHours: {
    hours: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    yelp: string;
    tiktok: string;
    googleReviews: string;
  };
}

interface DesktopNavProps {
  nav: SanityNav;
  isExperiencePage?: boolean;
  settings: SanitySettings;
}

export default function DesktopNav({ nav, isExperiencePage, settings }: DesktopNavProps) {
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
      // Debug the service link data

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

  const { contact, address, businessHours, social } = settings || {};

  const logo = nav.logo;

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const handleNavClick = () => closeModal();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      // Add a delay before removing from DOM to allow for transition
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Adjust timing based on your transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <button onClick={openModal}>
        <span className="flex h-auto items-center justify-center gap-2 rounded-md bg-background/75 px-5 py-2 text-xs font-semibold uppercase text-primary backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-primary hover:text-white hover:shadow-lg">
          <MenuIcon className="h-4 w-4" />
          Menu
        </span>
      </button>

      {shouldRender && (
        <div
          ref={menuRef}
          style={{
            pointerEvents: isOpen ? 'auto' : 'none',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 300ms ease-in-out',
          }}
          className="fixed inset-0 z-50 h-full w-full bg-black p-0 text-white"
        >
          <div className="flex h-screen w-full flex-row justify-between gap-12 overflow-clip md:items-center">
            <div className="relative h-full w-1/2">
              <Link href={'/experience'}>
                <div className="relative z-50 flex w-full flex-col items-center py-32 text-4xl font-light uppercase">
                  View Experience
                </div>
                <div className="absolute inset-0 m-12">
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <Image
                      src={'/images/fpo-nav.jpg'}
                      alt={'experience fpo image'}
                      fill
                      sizes="50vw"
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex h-full w-1/2 flex-col justify-between py-12">
              <div className="flex flex-grow flex-row items-center gap-12">
                <div className="flex flex-grow flex-row items-start">
                  <div className="flex w-1/2 flex-col gap-6">
                    {nav.companyLinks.map((link, index) => {
                      const linkData = getLink(link);
                      return (
                        <Link
                          key={`company-${index}`}
                          href={linkData.href}
                          target={linkData.target ? '_blank' : undefined}
                          className="text-2xl font-light transition-colors duration-300 hover:text-primary"
                          onClick={handleNavClick}
                        >
                          {linkData.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="flex w-1/2 flex-col items-start gap-6">
                    {nav.services?.map((link, index) => {
                      const linkData = getLink(link);
                      return (
                        <Link
                          key={`service-${index}`}
                          href={linkData.href}
                          target={linkData.target ? '_blank' : undefined}
                          className="text-2xl font-light transition-colors duration-300 hover:text-primary"
                          onClick={handleNavClick}
                        >
                          {linkData.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-8 text-gray-200">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-light text-slate-400">Contact Us</h3>
                  <div className="flex flex-row items-center gap-4">
                    {contact?.phone && (
                      <Link
                        href={`tel:${contact.phone}`}
                        className="font-light transition-colors duration-300 hover:text-primary"
                      >
                        {contact.phone}
                      </Link>
                    )}
                    <div className="h-4 w-[1px] bg-slate-400"></div>
                    {contact?.email && (
                      <Link
                        href={`mailto:${contact.email}`}
                        className="font-light transition-colors duration-300 hover:text-primary"
                      >
                        {contact.email}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-xl font-light text-slate-400">Location</h3>
                  <div className="flex flex-row items-start gap-4">
                    <div className="max-w-1/3 flex flex-col gap-2">
                      {address && (
                        <p className="text-sm font-light">
                          {address?.street && `${address.street}, `}
                          {address?.city && `${address.city}, `}
                          {address?.state && `${address.state} `}
                          {address?.zip && address.zip}
                        </p>
                      )}
                      {social && (
                        <div className="mt-4">
                          <SocialLinks
                            social={social}
                            className="flex gap-4"
                            iconClassName="w-4 h-4 text-gray-400 transition-colors duration-300 hover:text-primary"
                          />
                        </div>
                      )}
                    </div>
                    <div className="h-4 w-[1px] bg-slate-400"></div>
                    <div className="flex flex-col gap-2">
                      {businessHours?.hours && (
                        <p className="text-sm font-light">{businessHours.hours}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-20 top-6 m-6">
            <button onClick={closeModal}>
              <span className="flex h-auto items-center justify-center rounded-md bg-background px-5 py-2 align-middle text-xs font-medium uppercase tracking-[0.25em] text-slate-800 backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-primary hover:text-white hover:shadow-lg">
                Close
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
