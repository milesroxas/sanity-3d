'use client';
import SocialLinks from '@/components/ui/social-links';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

// Animation constants
const ANIMATION_CONFIG = {
  durations: {
    pageTransition: 0.3,
    menuContainer: 0.5,
    panelFade: 0.8,
    elementStagger: 0.05,
    elementFade: 0.4,
    imageScale: 0.7,
    closeButton: 0.4,
  },
  easing: {
    smooth: 'power2.inOut',
    easeOut: 'power2.out',
    easeIn: 'power2.in',
    elastic: 'expo.out',
  },
  stagger: {
    links: 0.05,
    linksReverse: 0.03,
  },
} as const;

// Types (keeping your existing interfaces)
interface SanityLogo {
  asset: any;
  alt?: string;
}

interface SanityNav {
  logo: SanityLogo;
  companyLinks: Array<any>;
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

// Custom hook for menu animations
const useMenuAnimations = (isOpen: boolean, shouldRender: boolean, onCloseComplete: () => void) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const mainLinksRef = useRef<HTMLDivElement>(null);
  const experienceTextRef = useRef<HTMLDivElement>(null);
  const experienceImageRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Animation utility functions
  const setInitialStates = useCallback(() => {
    const elements = {
      container: containerRef.current,
      leftPanel: leftPanelRef.current,
      rightPanel: rightPanelRef.current,
      closeButton: closeButtonRef.current,
      mainLinks: mainLinksRef.current?.querySelectorAll('a'),
      experienceText: experienceTextRef.current,
      experienceImage: experienceImageRef.current?.querySelector('img'),
      contactSection: contactSectionRef.current,
    };

    if (!elements.container) return elements;

    // Set initial states with null checks
    gsap.set(elements.container, { display: 'block', opacity: 0 });

    if (elements.leftPanel && elements.rightPanel) {
      gsap.set([elements.leftPanel, elements.rightPanel], { opacity: 0 });
    }

    if (elements.closeButton) {
      gsap.set(elements.closeButton, { scale: 0.7, opacity: 0 });
    }

    // Set states for elements that can be arrays or single elements
    const animatableElements = [
      elements.mainLinks,
      elements.experienceText,
      elements.contactSection,
    ].filter(Boolean);

    if (animatableElements.length > 0) {
      gsap.set(animatableElements, { opacity: 0, y: 20 });
    }

    if (elements.experienceImage) {
      gsap.set(elements.experienceImage, { scale: 1.25, opacity: 0 });
    }

    return elements;
  }, []);

  const createOpenAnimation = useCallback(() => {
    const elements = setInitialStates();
    if (!elements.container) return null;

    const tl = gsap.timeline();

    // 1. Fade in container
    tl.to(elements.container, {
      opacity: 1,
      duration: ANIMATION_CONFIG.durations.menuContainer,
      ease: ANIMATION_CONFIG.easing.smooth,
    });

    // 2. Fade in right panel
    if (elements.rightPanel) {
      tl.to(
        elements.rightPanel,
        {
          opacity: 1,
          duration: ANIMATION_CONFIG.durations.panelFade,
          ease: ANIMATION_CONFIG.easing.smooth,
        },
        '-=0.1'
      );
    }

    // Animate main links if they exist
    if (elements.mainLinks && elements.mainLinks.length > 0) {
      tl.to(
        elements.mainLinks,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.durations.elementFade,
          stagger: ANIMATION_CONFIG.stagger.links,
          ease: ANIMATION_CONFIG.easing.easeOut,
        },
        '-=0.5'
      );
    }

    // 3. Animate experience section
    if (elements.leftPanel) {
      tl.to(
        elements.leftPanel,
        {
          opacity: 1,
          duration: ANIMATION_CONFIG.durations.elementFade,
          ease: ANIMATION_CONFIG.easing.smooth,
        },
        '-=0.2'
      );
    }

    if (elements.experienceText) {
      tl.to(
        elements.experienceText,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.durations.elementFade,
          ease: ANIMATION_CONFIG.easing.easeOut,
        },
        '<+0.1'
      );
    }

    // 4. Scale in experience image
    if (elements.experienceImage) {
      tl.to(
        elements.experienceImage,
        {
          scale: 1,
          opacity: 1,
          duration: ANIMATION_CONFIG.durations.imageScale,
          ease: ANIMATION_CONFIG.easing.easeOut,
        },
        '<'
      );
    }

    // 5. Animate contact section and close button
    if (elements.contactSection) {
      tl.to(
        elements.contactSection,
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.durations.elementFade,
          ease: ANIMATION_CONFIG.easing.easeOut,
        },
        elements.experienceImage ? '-=0.3' : '-=0.1'
      );
    }

    if (elements.closeButton) {
      tl.to(
        elements.closeButton,
        {
          scale: 1,
          opacity: 1,
          duration: ANIMATION_CONFIG.durations.closeButton,
          ease: ANIMATION_CONFIG.easing.elastic,
          clearProps: 'scale,opacity',
        },
        '-=0.4'
      );
    }

    return tl;
  }, [setInitialStates]);

  const createCloseAnimation = useCallback(() => {
    const elements = {
      container: containerRef.current,
      leftPanel: leftPanelRef.current,
      rightPanel: rightPanelRef.current,
      closeButton: closeButtonRef.current,
      mainLinks: mainLinksRef.current?.querySelectorAll('a'),
      experienceText: experienceTextRef.current,
      experienceImage: experienceImageRef.current?.querySelector('img'),
      contactSection: contactSectionRef.current,
    };

    if (!elements.container) return null;

    const tl = gsap.timeline({
      onComplete: () => {
        // Call the cleanup function when animation is actually complete
        onCloseComplete();
      },
    });

    // 1. Fade out contact section
    if (elements.contactSection) {
      tl.to(elements.contactSection, {
        opacity: 0,
        y: 15,
        duration: 0.3,
        ease: ANIMATION_CONFIG.easing.easeIn,
      });
    }

    // Fade out close button (with scale)
    if (elements.closeButton) {
      tl.to(
        elements.closeButton,
        {
          opacity: 0,
          y: 15,
          scale: 0.7,
          duration: 0.3,
          ease: ANIMATION_CONFIG.easing.easeIn,
        },
        '<'
      ); // Start at the same time as contact section
    }

    // 2. Stagger out main links
    if (elements.mainLinks && elements.mainLinks.length > 0) {
      tl.to(
        elements.mainLinks,
        {
          opacity: 0,
          y: 15,
          duration: 0.3,
          stagger: {
            each: ANIMATION_CONFIG.stagger.linksReverse,
            from: 'end',
          },
          ease: ANIMATION_CONFIG.easing.easeIn,
        },
        '-=0.08'
      );
    }

    // 3. Fade out experience section
    if (elements.experienceImage) {
      tl.to(
        elements.experienceImage,
        {
          y: 20,
          opacity: 0,
          duration: 0.2,
          ease: ANIMATION_CONFIG.easing.easeIn,
        },
        '+=0.05'
      );
    }

    const experienceTargets = [elements.experienceText, elements.leftPanel].filter(Boolean);
    if (experienceTargets.length > 0) {
      tl.to(
        experienceTargets,
        {
          opacity: 0,
          y: 15,
          duration: 0.3,
          ease: ANIMATION_CONFIG.easing.easeIn,
        },
        elements.experienceImage ? '<' : '+=0.05'
      );
    }

    // 4. Fade out panels and container
    if (elements.rightPanel) {
      tl.to(
        elements.rightPanel,
        {
          opacity: 0,
          duration: ANIMATION_CONFIG.durations.panelFade,
          ease: ANIMATION_CONFIG.easing.smooth,
        },
        '-=0.1'
      );
    }

    tl.to(
      elements.container,
      {
        opacity: 0,
        duration: 1.2,
        ease: ANIMATION_CONFIG.easing.smooth,
      },
      '-=0.5'
    );

    return tl;
  }, [onCloseComplete]);

  // Main animation effect
  useGSAP(() => {
    if (!shouldRender) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (isOpen) {
      timelineRef.current = createOpenAnimation();
    } else {
      timelineRef.current = createCloseAnimation();
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isOpen, shouldRender, createOpenAnimation, createCloseAnimation]);

  return {
    refs: {
      containerRef,
      leftPanelRef,
      rightPanelRef,
      closeButtonRef,
      mainLinksRef,
      experienceTextRef,
      experienceImageRef,
      contactSectionRef,
    },
  };
};

// Custom hook for menu state management
const useMenuState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const openMenu = useCallback(() => {
    gsap.to('main', {
      opacity: 0,
      duration: ANIMATION_CONFIG.durations.pageTransition,
      ease: ANIMATION_CONFIG.easing.easeOut,
      onComplete: () => setIsOpen(true),
    });
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Callback for when close animation completes
  const onCloseComplete = useCallback(() => {
    setShouldRender(false);
    gsap.to('main', {
      opacity: 1,
      duration: 0.5,
      ease: ANIMATION_CONFIG.easing.easeIn,
    });
    document.body.style.overflow = '';
  }, []);

  // Handle side effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set('main', { opacity: 0 });
      setShouldRender(true);
    }
    // No else block needed - cleanup happens via animation callback
  }, [isOpen]);

  return {
    isOpen,
    shouldRender,
    openMenu,
    closeMenu,
    onCloseComplete,
  };
};

// Link utility function
const getLinkData = (link: any) => {
  if (!link) return { label: '', href: '#', target: false };

  if (link._type === 'pageLink' && link.page?.slug) {
    return {
      label: link.title || '',
      href: `/${link.page.slug.current || link.page.slug}`,
      target: false,
    };
  }

  if (link._type === 'servicesLink') {
    const slug =
      link.services?.slug?.current ||
      (typeof link.services?.slug === 'string' ? link.services.slug : '');
    return {
      label: link.title || '',
      href: slug ? `/services/${slug}` : '/services',
      target: false,
    };
  }

  if (link.url) {
    return {
      label: link.title || '',
      href: link.url,
      target: link.openInNewTab || false,
    };
  }

  return { label: link.title || '', href: '#', target: false };
};

// Main component
export default function DesktopNav({ nav, isExperiencePage, settings }: DesktopNavProps) {
  const { contact, address, businessHours, social } = settings || {};
  const { isOpen, shouldRender, openMenu, closeMenu, onCloseComplete } = useMenuState();
  const { refs } = useMenuAnimations(isOpen, shouldRender, onCloseComplete);

  const handleNavClick = useCallback(() => closeMenu(), [closeMenu]);

  return (
    <>
      <button onClick={openMenu} aria-label="Open menu" aria-expanded={isOpen}>
        <span className="flex h-auto items-center justify-center gap-2 rounded-md bg-background/75 px-5 py-2 text-xs font-semibold uppercase text-primary backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-primary hover:text-white hover:shadow-lg">
          <MenuIcon className="h-4 w-4" />
          Menu
        </span>
      </button>

      {shouldRender && (
        <div
          ref={refs.containerRef}
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
          className="fixed inset-0 z-50 h-screen w-full bg-black p-0 text-white"
        >
          <div className="flex h-screen w-full flex-row justify-between gap-12 overflow-clip md:items-center">
            {/* Experience Panel */}
            <div ref={refs.leftPanelRef} className="relative h-full w-1/2">
              <Link href="/experience" onClick={handleNavClick} className="block h-full w-full">
                <div
                  ref={refs.experienceTextRef}
                  className="relative z-50 flex w-full flex-col items-center py-32 text-4xl font-light uppercase"
                >
                  View Experience
                </div>
                <div className="absolute inset-0 m-12">
                  <div
                    ref={refs.experienceImageRef}
                    className="relative h-full w-full overflow-hidden rounded-lg"
                  >
                    <Image
                      src="/images/fpo-nav.jpg"
                      alt="experience fpo image"
                      fill
                      sizes="50vw"
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Panel */}
            <div
              ref={refs.rightPanelRef}
              className="flex h-full w-1/2 flex-col justify-between py-12 pr-12"
            >
              <div className="flex flex-grow flex-col">
                <div
                  ref={refs.mainLinksRef}
                  className="flex flex-grow flex-row items-center gap-12"
                >
                  <div className="flex flex-grow flex-row items-start">
                    {/* Company Links */}
                    <div className="flex w-1/2 flex-col gap-6">
                      {nav.companyLinks.map((link, index) => {
                        const linkData = getLinkData(link);
                        return (
                          <Link
                            key={`company-${index}`}
                            href={linkData.href}
                            target={linkData.target ? '_blank' : undefined}
                            rel={linkData.target ? 'noopener noreferrer' : undefined}
                            className="text-2xl font-light transition-colors duration-300 hover:text-primary"
                            onClick={handleNavClick}
                          >
                            {linkData.label}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Service Links */}
                    <div className="flex w-1/2 flex-col items-start gap-6">
                      {nav.services?.map((link, index) => {
                        const linkData = getLinkData(link);
                        return (
                          <Link
                            key={`service-${index}`}
                            href={linkData.href}
                            target={linkData.target ? '_blank' : undefined}
                            rel={linkData.target ? 'noopener noreferrer' : undefined}
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

                {/* Contact Section */}
                <div
                  ref={refs.contactSectionRef}
                  className="mt-auto flex flex-col gap-8 text-gray-200"
                >
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
                      {contact?.phone && contact?.email && (
                        <div className="h-4 w-[1px] bg-slate-400"></div>
                      )}
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
                      {address && businessHours?.hours && (
                        <div className="mx-2 h-5 w-[1px] bg-slate-400"></div>
                      )}
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
          </div>

          {/* Close Button */}
          <div ref={refs.closeButtonRef} className="absolute right-24 top-24 md:right-12 md:top-12">
            <button onClick={closeMenu} aria-label="Close menu">
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
