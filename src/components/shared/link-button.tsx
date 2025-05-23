// components/ui/link-button.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';

interface LinkButtonProps {
  link: Sanity.Link;
  variant?: 'default' | 'secondary' | 'link' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  index?: number; // for fallback keys
}

export function LinkButton({
  link,
  variant,
  size = 'default',
  className,
  index = 0,
}: LinkButtonProps) {
  if (!link) return null;

  // Handle page links
  if (link._type === 'pageLink') {
    const pageLink = link as Sanity.PageLink;
    if (!pageLink.page?.slug?.current) return null;

    return (
      <Button variant={variant || 'default'} size={size} className={className} asChild>
        <Link href={`/${pageLink.page.slug.current}`}>{pageLink.title}</Link>
      </Button>
    );
  }

  if (link._type === 'servicesLink') {
    const servicesLink = link as Sanity.ServicesLink;
    if (!servicesLink.services?.slug?.current) return null;

    return (
      <Button variant={variant || 'default'} size={size} className={className} asChild>
        <Link href={`/services/${servicesLink.services.slug.current}`}>{servicesLink.title}</Link>
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
}

export function LinkButtons({
  links,
  variant,
  size = 'default',
  className,
  containerClassName,
  direction = 'row',
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
        />
      ))}
    </div>
  );
}
