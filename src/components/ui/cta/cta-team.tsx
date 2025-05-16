import { cn } from '@/lib/utils';
import type { PortableTextBlock } from '@portabletext/react';

import { fetchSanityTeamList } from '@/app/(main)/team/actions';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import CtaTeamList from './cta-team.client';

export default async function CtaTeam({
  padding,
  colorVariant,
  sectionWidth = 'default',
  stackAlign = 'left',
  tagLine,
  title,
  body,
  links,
}: Partial<{
  padding: ISectionPadding;
  colorVariant: ISectionContainerProps['color'];
  stackAlign: 'left' | 'center';
  sectionWidth: 'default' | 'narrow';
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  links: {
    title: string;
    href: string;
    target?: boolean;
    buttonVariant:
      | 'default'
      | 'secondary'
      | 'link'
      | 'destructive'
      | 'outline'
      | 'ghost'
      | null
      | undefined;
  }[];
}>) {
  const isNarrow = stegaClean(sectionWidth) === 'narrow';
  const align = stegaClean(stackAlign);
  const color = stegaClean(colorVariant);

  // Fetch team members
  const allTeamMembers = await fetchSanityTeamList();

  // Just get the first 6 team members (or fewer if less than 6 are available)
  const limitedTeamMembers = allTeamMembers.slice(0, 6);

  // Split into team members for different layouts
  // For mobile, we'll show fewer members (first 3)
  // For desktop, we'll show up to 6 in two columns
  const leftColumnMembers = limitedTeamMembers.slice(0, 3);
  const rightColumnMembers = limitedTeamMembers.slice(3, 6);

  return (
    <SectionContainer color={color} padding={padding}>
      {/* Main container with improved responsive layout */}
      <div className="relative flex flex-col justify-between overflow-x-clip">
        {/* Mobile layout - single column with content first, then cards */}
        <div className="grid w-full grid-cols-1 gap-8 md:hidden">
          {/* Center content for mobile */}
          <div className="z-20 px-4">
            <MobileContent
              tagLine={tagLine}
              title={title}
              body={body}
              links={links}
              align={align}
              color={color}
            />
          </div>

          {/* Mobile team members - showing just the first 3 in a single row */}
          <div className="relative h-64 overflow-visible px-4">
            <CtaTeamList teamMembers={leftColumnMembers} position="left" />
          </div>
        </div>

        {/* Desktop layout - three columns */}
        <div className="hidden w-full grid-cols-12 gap-4 md:grid">
          {/* Left column team members */}
          <div className="col-span-3 h-[500px] md:col-span-3 lg:col-span-3">
            <CtaTeamList teamMembers={leftColumnMembers} position="left" />
          </div>

          {/* Center content */}
          <div className="col-span-6 flex items-center justify-center px-4 py-12">
            <div
              className={cn(
                'relative z-20 w-full max-w-[420px]',
                color === 'primary' ? 'text-background' : undefined
              )}
            >
              {tagLine && (
                <h1 className="mb-4 text-sm leading-[0] md:text-base">
                  <span className="font-semibold uppercase">{tagLine}</span>
                </h1>
              )}
              <h2 className="mb-4 text-2xl font-bold text-card-foreground md:text-3xl lg:text-4xl">
                {title}
              </h2>
              {body && <PortableTextRenderer value={body} />}
              {links && links.length > 0 && (
                <div
                  className={cn(
                    'mt-6 flex flex-wrap gap-3 md:mt-10 md:gap-4',
                    align === 'center' ? 'justify-center' : undefined
                  )}
                >
                  {links.map(link => {
                    if (!link) return null;
                    if ((link as any)._type === 'reference' && (link as any).slug) {
                      const ref = link as {
                        _id?: string;
                        title?: string;
                        slug?: { current: string };
                      };
                      return (
                        <Button key={ref._id || ref.title} variant="default" asChild>
                          <Link href={`/${ref.slug?.current || ''}`}>{ref.title}</Link>
                        </Button>
                      );
                    }
                    // Only render if href is a non-empty string
                    if (typeof link.href === 'string' && link.href.trim() !== '') {
                      return (
                        <Button
                          key={link.title}
                          variant={stegaClean((link as any)?.buttonVariant)}
                          size="sm"
                          className="md:size-md"
                          asChild
                        >
                          <Link
                            href={link.href}
                            target={link.target ? '_blank' : undefined}
                            rel="noopener noreferrer"
                          >
                            {link.title}
                          </Link>
                        </Button>
                      );
                    }
                    // Otherwise, skip rendering
                    return null;
                  })}
                </div>
              )}
              <div className="pointer-events-none absolute bottom-[-100px] left-[-100px] md:bottom-[-150px] md:left-[-160px]">
                <Image
                  src="/images/security-officer.png"
                  alt=""
                  width={120}
                  height={120}
                  className="w-16 md:w-24 lg:w-32"
                />
              </div>
            </div>
          </div>

          {/* Right column team members */}
          <div className="col-span-3 h-[500px] md:col-span-3 lg:col-span-3">
            <CtaTeamList teamMembers={rightColumnMembers} position="right" />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

// Extracted mobile content component to keep the code DRY
function MobileContent({
  tagLine,
  title,
  body,
  links,
  align,
  color,
}: {
  tagLine?: string;
  title?: string;
  body?: PortableTextBlock[];
  links?: any[];
  align?: string;
  color?: string;
}) {
  return (
    <div
      className={cn('relative z-20 w-full', color === 'primary' ? 'text-background' : undefined)}
    >
      {tagLine && (
        <h1 className="mb-3 text-xs leading-[0]">
          <span className="font-semibold uppercase">{tagLine}</span>
        </h1>
      )}
      <h2 className="mb-3 text-xl font-bold text-card-foreground">{title}</h2>
      {body && <PortableTextRenderer value={body} />}
      {links && links.length > 0 && (
        <div
          className={cn(
            'mt-6 flex flex-wrap gap-2',
            align === 'center' ? 'justify-center' : undefined
          )}
        >
          {links.map(link => {
            if (!link) return null;
            if ((link as any)._type === 'reference' && (link as any).slug) {
              const ref = link as {
                _id?: string;
                title?: string;
                slug?: { current: string };
              };
              return (
                <Button key={ref._id || ref.title} variant="default" size="sm" asChild>
                  <Link href={`/${ref.slug?.current || ''}`}>{ref.title}</Link>
                </Button>
              );
            }
            // Only render if href is a non-empty string
            if (typeof link.href === 'string' && link.href.trim() !== '') {
              return (
                <Button
                  key={link.title}
                  variant={stegaClean((link as any)?.buttonVariant)}
                  size="sm"
                  asChild
                >
                  <Link
                    href={link.href}
                    target={link.target ? '_blank' : undefined}
                    rel="noopener noreferrer"
                  >
                    {link.title}
                  </Link>
                </Button>
              );
            }
            // Otherwise, skip rendering
            return null;
          })}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-[-100px] right-[40px] md:bottom-[-80px] md:right-[-40px] lg:bottom-[-80px] lg:right-[-40px]">
        <Image
          src="/images/security-officer.png"
          alt=""
          width={80}
          height={80}
          className="w-16 lg:w-24"
        />
      </div>
    </div>
  );
}
