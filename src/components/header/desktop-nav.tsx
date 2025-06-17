'use client';
import SocialLinks from '@/components/ui/social-links';
import {
  ANIMATION_CONFIG,
  getLinkData,
  useNavigationStore,
  type SanityNav,
  type SanitySettings,
} from '@/store/navStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';

interface DesktopNavProps {
  nav: SanityNav;
  settings: SanitySettings;
}

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

    gsap.set(elements.container, {
      display: 'block',
      opacity: 0,
      visibility: 'hidden',
    });

    if (elements.leftPanel && elements.rightPanel) {
      gsap.set([elements.leftPanel, elements.rightPanel], { opacity: 0 });
    }

    if (elements.closeButton) {
      gsap.set(elements.closeButton, { scale: 0.7, opacity: 0 });
    }

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

    // 1. Make visible and fade in container
    tl.set(elements.container, { visibility: 'visible' }).to(elements.container, {
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
        if (elements.container) {
          gsap.set(elements.container, { visibility: 'hidden' });
        }
        onCloseComplete();
      },
    });

    if (elements.contactSection) {
      tl.to(elements.contactSection, {
        opacity: 0,
        y: 15,
        duration: 0.3,
        ease: ANIMATION_CONFIG.easing.easeIn,
      });
    }

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
      );
    }

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

  useGSAP(() => {
    if (!shouldRender) return;

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

const useMenuState = () => {
  const {
    isMenuOpen,
    shouldRenderMenu,
    isMenuAnimating,
    openMenu: storeOpenMenu,
    closeMenu: storeCloseMenu,
    setMenuRenderState,
    setMenuAnimating,
    navigationAction,
    setNavigationAction,
  } = useNavigationStore();

  const openMenu = useCallback(() => {
    if (isMenuAnimating || isMenuOpen) return;

    gsap.to('main', {
      opacity: 0,
      pointerEvents: 'none', // Added pointerEvents: 'none' here for consistency
      duration: ANIMATION_CONFIG.durations.pageTransition,
      ease: ANIMATION_CONFIG.easing.easeOut,
      onComplete: () => {
        storeOpenMenu();
      },
    });
  }, [isMenuAnimating, isMenuOpen, storeOpenMenu]);

  const closeMenu = useCallback(() => {
    if (isMenuAnimating) return;
    storeCloseMenu();
  }, [isMenuAnimating, storeCloseMenu]);

  const onCloseComplete = useCallback(() => {
    setMenuRenderState(false);
    setMenuAnimating(false);
    gsap.to('main', {
      opacity: 1,
      duration: 0.5,
      ease: ANIMATION_CONFIG.easing.easeIn,
      pointerEvents: 'auto',
      onComplete: () => {
        if (navigationAction) {
          navigationAction();
          setNavigationAction(null);
        }
      },
    });
    document.body.style.overflow = '';
  }, [setMenuRenderState, setMenuAnimating, navigationAction]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set('main', { opacity: 0, pointerEvents: 'none' });
    }
  }, [isMenuOpen]);

  return {
    isOpen: isMenuOpen,
    shouldRender: shouldRenderMenu,
    openMenu,
    closeMenu,
    onCloseComplete,
  };
};

export default function DesktopNav({ nav, settings }: DesktopNavProps) {
  const { contact, address, businessHours, social } = settings || {};
  const { isOpen, shouldRender, openMenu, closeMenu, onCloseComplete } = useMenuState();

  const { refs } = useMenuAnimations(isOpen, shouldRender, onCloseComplete);

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
          style={{
            pointerEvents: isOpen ? 'auto' : 'none',
            visibility: 'hidden',
            opacity: 0,
          }}
          className="fixed inset-0 z-50 h-screen w-full bg-black p-0 text-white" // Ensure z-index is high enough
        >
          <div className="flex h-screen w-full flex-row justify-between gap-12 overflow-clip md:items-center">
            {/* Experience Panel */}
            <div ref={refs.leftPanelRef} className="relative h-full w-1/2">
              <Link href="/experience" className="block h-full w-full">
                <div
                  ref={refs.experienceTextRef}
                  className="relative z-50 flex w-full flex-col items-center py-32 text-4xl font-light uppercase" // text-center might be useful
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
                      {nav.companyLinks?.map((link, index) => {
                        const linkData = getLinkData(link);
                        return (
                          <Link
                            key={`company-${index}`}
                            href={linkData.href}
                            target={linkData.target ? '_blank' : undefined}
                            rel={linkData.target ? 'noopener noreferrer' : undefined}
                            className="text-2xl font-light transition-colors duration-300 hover:text-primary"
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
                  className="mt-auto flex flex-col gap-8 text-gray-200" // Consider text-sm or text-base for readability
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
                      {address &&
                        businessHours?.hours && ( // This condition means divider only shows if both exist
                          <div className="mx-2 h-5 w-[1px] bg-slate-400"></div> // h-5 is 20px, adjust if needed
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
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              disabled={shouldRender && isOpen && false}
            >
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
