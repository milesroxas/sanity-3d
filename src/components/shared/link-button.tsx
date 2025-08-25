'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import type { LucideIcon } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

type IconPosition = 'left' | 'right';

interface CommonLinkProps extends Omit<ButtonProps, 'children'> {
  icon?: LucideIcon;
  iconPosition?: IconPosition;
  onClick?: () => void;
  className?: string;
}

interface LinkButtonProps extends CommonLinkProps {
  link: Sanity.Link;
  index?: number;
}

export function LinkButton({
  link,
  variant,
  size = 'default',
  className,
  onClick,
  icon: Icon,
  iconPosition = 'left',
  ...buttonProps
}: LinkButtonProps) {
  const { setSelectedScene } = useLogoMarkerStore();
  const pathname = usePathname();

  // Keep your existing experience-page reset behavior
  useEffect(() => {
    const isExperiencePage = pathname === '/experience' || pathname.startsWith('/experience/');
    if (!isExperiencePage) {
      gsap.set('main', { opacity: 1, pointerEvents: 'auto' });
      setSelectedScene(null);
      // If you still need header/nav explicit resets, add them here
      const header = document.querySelector('header') as HTMLElement | null;
      const nav = document.querySelector('header > div > div > div') as HTMLElement | null;
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
    }
  }, [pathname, setSelectedScene]);

  if (!link) return null;

  const render = (title: string, EffectiveIcon?: LucideIcon) => (
    <>
      {EffectiveIcon && iconPosition === 'left' && <EffectiveIcon />}
      <span>{title}</span>
      {EffectiveIcon && iconPosition === 'right' && <EffectiveIcon />}
    </>
  );

  // Page link
  if (link._type === 'pageLink') {
    const pageLink = link as Sanity.PageLink;
    if (!pageLink.page?.slug?.current) return null;
    const buttonVariant = variant ?? stegaClean(pageLink.buttonVariant);
    const title = pageLink.title;

    return (
      <Button asChild variant={buttonVariant} size={size} className={className} {...buttonProps}>
        <Link
          href={`/${pageLink.page.slug.current}`}
          onClick={() => {
            window.dispatchEvent(new CustomEvent('forceNavVisible'));
            onClick?.();
          }}
        >
          {render(title, Icon)}
        </Link>
      </Button>
    );
  }

  // Services link
  if (link._type === 'servicesLink') {
    const servicesLink = link as Sanity.ServicesLink;
    if (!servicesLink.services?.slug?.current) return null;
    const buttonVariant = variant ?? stegaClean(servicesLink.buttonVariant);
    const title = servicesLink.title;

    return (
      <Button asChild variant={buttonVariant} size={size} className={className} {...buttonProps}>
        <Link
          href={`/services/${servicesLink.services.slug.current}`}
          onClick={() => {
            window.dispatchEvent(new CustomEvent('forceNavVisible'));
            onClick?.();
          }}
        >
          {render(title, Icon)}
        </Link>
      </Button>
    );
  }

  // Custom link
  if (link._type === 'customLink') {
    const customLink = link as Sanity.CustomLink;
    const isExternal = Boolean(customLink.target);
    const EffectiveIcon: LucideIcon | undefined = Icon ?? (isExternal ? ExternalLink : undefined);
    const buttonVariant = variant ?? stegaClean(customLink.buttonVariant);
    const title = customLink.title;

    return (
      <Button asChild variant={buttonVariant} size={size} className={className} {...buttonProps}>
        <Link
          href={customLink.href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener' : undefined}
          onClick={() => {
            if (!isExternal) {
              window.dispatchEvent(new CustomEvent('forceNavVisible'));
            }
            onClick?.();
          }}
        >
          {render(title, EffectiveIcon)}
        </Link>
      </Button>
    );
  }

  return null;
}

interface LinkButtonsProps extends CommonLinkProps {
  links: Sanity.Link[];
  containerClassName?: string;
  direction?: 'row' | 'column';
}

export function LinkButtons({
  links,
  variant,
  size = 'default',
  className,
  containerClassName,
  direction = 'row',
  onClick,
  icon,
  iconPosition = 'left',
  ...buttonProps
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
          onClick={onClick}
          icon={icon}
          iconPosition={iconPosition}
          {...buttonProps}
        />
      ))}
    </div>
  );
}
