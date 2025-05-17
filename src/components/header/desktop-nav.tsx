import Link from 'next/link';
import { Button } from '../ui/button';

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
interface DesktopNavProps {
  nav: SanityNav;
  isExperiencePage?: boolean;
}

export default function DesktopNav({ nav, isExperiencePage }: DesktopNavProps) {
  // Helper function to get link data similar to the footer component
  const getLink = (link: any) => {
    if (!link) return { label: '', href: '#', target: false };

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

  return (
    <div className="hidden items-center gap-7 text-primary xl:flex">
      {nav.companyLinks.map((navItem, index) => {
        const link = getLink(navItem);
        return (
          <Link
            key={`nav-item-${index}-${link.label}`}
            href={link.href}
            target={link.target ? '_blank' : undefined}
            rel={link.target ? 'noopener noreferrer' : undefined}
            className={`transition-colors hover:text-primary ${isExperiencePage ? 'text-white hover:text-white/80' : 'text-foreground/80'} text-xs font-semibold uppercase`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        key="contact"
        href="/contact"
        className={`transition-colors hover:text-primary ${isExperiencePage ? 'text-white hover:text-white/80' : 'text-foreground/80'} text-sm font-semibold uppercase`}
      >
        <Button size="sm" variant="default">
          Get in Touch
        </Button>
      </Link>
    </div>
  );
}
