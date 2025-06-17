import { cn } from '@/lib/utils';
import type { PortableTextBlock } from '@portabletext/react';

import { fetchSanityTeamList } from '@/app/(main)/team/actions';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import CtaTeamList, { CtaTeamModalProvider } from './cta-team.client';

interface CtaTeamProps {
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant: ISectionContainerProps['color'];
  sectionWidth: 'default' | 'narrow';
  stackAlign: 'left' | 'center';
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  links: Sanity.Link[];
}

export default async function CtaTeam({
  padding,
  direction,
  colorVariant,
  sectionWidth = 'default',
  stackAlign = 'left',
  tagLine,
  title,
  body,
  links,
}: Partial<CtaTeamProps>) {
  const isNarrow = stegaClean(sectionWidth) === 'narrow';
  const align = stegaClean(stackAlign);
  const color = stegaClean(colorVariant);

  // Combine padding and direction into ISectionPadding object
  const sectionPadding: ISectionPadding | undefined =
    padding && direction
      ? {
          padding: stegaClean(padding),
          direction: stegaClean(direction),
        }
      : undefined;

  // Fetch team members
  const allTeamMembers = await fetchSanityTeamList();

  // Just get the first 6 team members (or fewer if less than 6 are available)
  const limitedTeamMembers = allTeamMembers.slice(0, 6);

  const leftColumnMembers = limitedTeamMembers.slice(0, 3);
  const rightColumnMembers = limitedTeamMembers.slice(3, 6);

  return (
    <CtaTeamModalProvider allTeamMembers={limitedTeamMembers}>
      <SectionContainer color={color} padding={sectionPadding}>
        {/* Main container with improved responsive layout */}
        <div className="relative flex flex-col justify-between overflow-x-clip">
          {/* Mobile layout - single column with content only, no team cards */}
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
          </div>

          {/* Desktop layout - three columns */}
          <div className="hidden w-full grid-cols-12 gap-4 md:grid">
            {/* Left column team members */}
            <div className="col-span-3 h-[500px] md:col-span-3 lg:col-span-3">
              <CtaTeamList teamMembers={leftColumnMembers} position="left" />
            </div>

            {/* Center content */}
            <div className="col-span-5 flex items-center justify-center px-4 py-12">
              <div
                className={cn(
                  'relative z-20 w-full',
                  color === 'primary' ? 'text-background' : undefined
                )}
              >
                {tagLine && (
                  <h1 className="mb-4 text-sm leading-[0] md:text-sm">
                    <span className="font-semibold uppercase">{tagLine}</span>
                  </h1>
                )}
                <h2 className="mb-4 text-xl font-bold text-card-foreground md:text-3xl lg:text-4xl">
                  {title}
                </h2>
                {body && <PortableTextRenderer value={body} />}

                <LinkButtons
                  links={links || []}
                  size="default"
                  containerClassName={cn(
                    'mt-6 md:mt-10',
                    align === 'center' ? 'justify-center' : undefined
                  )}
                  className="md:size-md"
                />

                <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] md:bottom-[-200px] md:right-[0px] lg:bottom-[-220px] lg:right-[-100px]">
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
    </CtaTeamModalProvider>
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
  links?: Sanity.Link[];
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

      <LinkButtons
        links={links || []}
        size="sm"
        containerClassName={cn('mt-6', align === 'center' ? 'justify-center' : undefined)}
      />

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
