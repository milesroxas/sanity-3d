'use client';
// components/ui/link-button.tsx
import { Button } from '@/components/ui/button';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface LinkButtonProps {
  link: Sanity.Link;
  variant?: 'default' | 'secondary' | 'link' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  index?: number; // for fallback keys
  onClick?: () => void; // Add onClick handler prop
}

export function LinkButton({
  link,
  variant,
  size = 'default',
  className,
  index = 0,
  onClick,
}: LinkButtonProps) {
  const { setSelectedScene } = useLogoMarkerStore();
  const pathname = usePathname();

  // Reset marker states whenever navigating away from experience page
  useEffect(() => {
    const isExperiencePage = pathname === '/experience' || pathname.startsWith('/experience/');

    if (!isExperiencePage) {
      // Ensure main content is clickable
      gsap.set('main', {
        opacity: 1,
        pointerEvents: 'auto',
      });

      // Make header and nav visible
      const header = document.querySelector('header') as HTMLElement;
      const nav = document.querySelector('header > div > div > div') as HTMLElement;
      if (header && nav) {
        gsap.to([header, nav], {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onStart: () => {
            header.style.pointerEvents = 'auto';
            nav.style.pointerEvents = 'auto';
          },
        });
      }

      // Reset selected scene
      setSelectedScene(null);
    }
  }, [pathname, setSelectedScene]);

  if (!link) return null;

  // Handle page links
  if (link._type === 'pageLink') {
    const pageLink = link as Sanity.PageLink;
    if (!pageLink.page?.slug?.current) return null;

    return (
      <Button variant={variant || 'default'} size={size} className={className} asChild>
        <Link
          href={`/${pageLink.page.slug.current}`}
          onClick={e => {
            // Trigger header visibility before navigation
            window.dispatchEvent(new CustomEvent('forceNavVisible'));

            // Force immediate styles for header visibility
            const header = document.querySelector('header') as HTMLElement;
            const nav = document.querySelector('header > div > div > div') as HTMLElement;
            if (header && nav) {
              header.style.opacity = '1';
              nav.style.opacity = '1';
              header.style.pointerEvents = 'auto';
              nav.style.pointerEvents = 'auto';
            }

            // Call the custom onClick if provided
            onClick?.();
          }}
        >
          {pageLink.title}
        </Link>
      </Button>
    );
  }

  if (link._type === 'servicesLink') {
    const servicesLink = link as Sanity.ServicesLink;
    if (!servicesLink.services?.slug?.current) return null;

    return (
      <Button variant={variant || 'default'} size={size} className={className} asChild>
        <Link
          href={`/services/${servicesLink.services.slug.current}`}
          onClick={e => {
            // Trigger header visibility before navigation
            window.dispatchEvent(new CustomEvent('forceNavVisible'));

            // Force immediate styles for header visibility
            const header = document.querySelector('header') as HTMLElement;
            const nav = document.querySelector('header > div > div > div') as HTMLElement;
            if (header && nav) {
              header.style.opacity = '1';
              nav.style.opacity = '1';
              header.style.pointerEvents = 'auto';
              nav.style.pointerEvents = 'auto';
            }

            // Call the custom onClick if provided
            onClick?.();
          }}
        >
          {servicesLink.title}
        </Link>
      </Button>
    );
  }

  // Handle custom links
  if (link._type === 'customLink') {
    const customLink = link as Sanity.CustomLink;
    return (
      <Button
        variant={variant ? stegaClean(variant) : stegaClean(customLink.buttonVariant)}
        size={size}
        className={className}
        asChild
      >
        <Link
          href={customLink.href}
          target={customLink.target ? '_blank' : undefined}
          rel={customLink.target ? 'noopener' : undefined}
          onClick={e => {
            // Only apply these effects for internal links (not external)
            if (!customLink.target) {
              // Trigger header visibility before navigation
              window.dispatchEvent(new CustomEvent('forceNavVisible'));

              // Force immediate styles for header visibility
              const header = document.querySelector('header') as HTMLElement;
              const nav = document.querySelector('header > div > div > div') as HTMLElement;
              if (header && nav) {
                header.style.opacity = '1';
                nav.style.opacity = '1';
                header.style.pointerEvents = 'auto';
                nav.style.pointerEvents = 'auto';
              }
            }

            // Call the custom onClick if provided
            onClick?.();
          }}
        >
          {customLink.title}
        </Link>
      </Button>
    );
  }

  return null;
}

interface LinkButtonsProps {
  links: Sanity.Link[];
  variant?: 'default' | 'secondary' | 'link' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  containerClassName?: string;
  direction?: 'row' | 'column';
  onClick?: () => void; // Add onClick handler prop
}

export function LinkButtons({
  links,
  variant,
  size = 'default',
  className,
  containerClassName,
  direction = 'row',
  onClick,
}: LinkButtonsProps) {
  if (!links || links.length === 0) return null;

  return (
    <div
      className={cn(
        direction === 'row' ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2',
        containerClassName
      )}
    >
      {links.map((link, index) => (
        <LinkButton
          key={link._key || index}
          link={link}
          variant={variant}
          size={size}
          className={className}
          index={index}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
