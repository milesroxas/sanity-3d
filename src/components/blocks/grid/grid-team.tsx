'use client';
import TeamModal from '@/components/ui/TeamModal';
import { ISectionContainerProps } from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface GridTeamProps {
  color: 'primary' | 'secondary' | 'card' | 'accent' | 'destructive' | 'background' | 'transparent';
  themeVariant?: ISectionContainerProps['theme'];
  title: string;
  slug: Sanity.Team['slug'];
  role?: string;
  image?: Sanity.Image;
  bio?: any;
  renderContext?: string;
}

export default function GridTeam({ title, slug, role, image, bio, renderContext }: GridTeamProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const cardInner = (
    <div
      className={cn(
        'duration-250 group flex w-full flex-col justify-between overflow-hidden rounded-md bg-card/50 p-4 transition ease-in-out hover:bg-card/70 hover:shadow-lg'
      )}
    >
      <div className="flex flex-col">
        {image && image.asset?._id && (
          <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-sm">
            <Image
              src={urlFor(image.asset).url()}
              alt={image.alt || ''}
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ''}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              quality={100}
            />
          </div>
        )}
        {title && (
          <h3 className={cn('mb-1 text-lg font-bold leading-[1.2] text-card-foreground')}>
            {title}
          </h3>
        )}
        {role && <p className={cn('text-sm text-muted-foreground')}>{role}</p>}
      </div>
    </div>
  );

  if (renderContext === 'overlay') {
    return (
      <>
        <button
          type="button"
          className="group flex w-full rounded-3xl text-left ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setModalOpen(true)}
        >
          {cardInner}
        </button>
        <TeamModal
          title={title}
          role={role || ''}
          image={image}
          bio={bio}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    );
  }

  return (
    <Link
      className="group flex w-full rounded-3xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      href={slug?.current ? `/team/${slug.current}` : '#'}
    >
      {cardInner}
    </Link>
  );
}
