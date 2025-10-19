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
  const align = stegaClean(stackAlign);
  const color = stegaClean(colorVariant);

  const sectionPadding: ISectionPadding | undefined =
    padding && direction
      ? {
          padding: stegaClean(padding),
          direction: stegaClean(direction),
        }
      : undefined;

  const allTeamMembers = await fetchSanityTeamList();
  const limitedTeamMembers = allTeamMembers.slice(0, 6);

  return (
    <CtaTeamModalProvider allTeamMembers={limitedTeamMembers}>
      <SectionContainer color={color} padding={sectionPadding}>
        <div className="md:overflow-hidden">
          {/* Mobile layout */}
          <div className="flex max-w-md flex-col gap-12 md:hidden">
            <div className="relative pb-16">
              {tagLine && (
                <h2 className="mb-3 text-xs leading-[0]">
                  <span className="font-semibold uppercase">{tagLine}</span>
                </h2>
              )}
              <h3 className="mb-4 text-3xl font-bold text-card-foreground">{title}</h3>
              {body && <PortableTextRenderer value={body} />}

              <LinkButtons
                links={links || []}
                size="default"
                containerClassName={cn('mt-6', align === 'center' ? 'justify-center' : undefined)}
              />

              {/* Security officer graphic for mobile */}
              <div className="pointer-events-none absolute bottom-0 right-[-20px]">
                <Image
                  src="/images/security-officer.png"
                  alt=""
                  width={100}
                  height={100}
                  className="w-20"
                />
              </div>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden grid-cols-2 gap-8 md:grid lg:gap-12">
            {/* Left column */}
            <div className="relative flex flex-col justify-center">
              <div>
                {tagLine && (
                  <h2 className="mb-4 text-sm leading-[0]">
                    <span className="font-semibold uppercase">{tagLine}</span>
                  </h2>
                )}
                <h3 className="mb-6 text-3xl font-bold text-card-foreground lg:max-w-sm lg:text-3xl">
                  {title}
                </h3>
                {body && <PortableTextRenderer value={body} />}

                <LinkButtons
                  links={links || []}
                  size="default"
                  containerClassName={cn('mt-8', align === 'center' ? 'justify-center' : undefined)}
                />
              </div>

              {/* Security officer graphic positioned at the edge */}
              <div className="pointer-events-none absolute bottom-0 right-0 z-10 md:bottom-8 md:right-[-20px] lg:right-0">
                <Image
                  src="/images/security-officer.png"
                  alt=""
                  width={100}
                  height={100}
                  className="w-12 md:w-16 lg:w-32"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex items-center">
              <CtaTeamList teamMembers={limitedTeamMembers} />
            </div>
          </div>
        </div>
      </SectionContainer>
    </CtaTeamModalProvider>
  );
}
