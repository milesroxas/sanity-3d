'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { PortableTextBlock } from 'next-sanity';
import { useRef } from 'react';

interface Hero2Props {
  _key?: string;
  tagLine?: string;
  title?: string;
  body?: PortableTextBlock[];
  links?: Sanity.Link[];
}

export default function Hero2({ tagLine, title, body, links, _key }: Hero2Props) {
  const ref = useRef(null);

  return (
    <div ref={ref} className="container flex flex-col py-20 dark:bg-background">
      {tagLine && (
        <h1 className="font-sans leading-[0]">
          <span className="text-base font-semibold">{tagLine}</span>
        </h1>
      )}
      {title && (
        <h2 className="mt-6 text-4xl font-bold leading-[1.1] text-card-foreground md:text-5xl lg:text-6xl">
          {title}
        </h2>
      )}
      {body && (
        <div className="mt-6 max-w-2xl text-lg text-muted-foreground lg:max-w-3xl lg:text-3xl">
          <PortableTextRenderer value={body} />
        </div>
      )}
      {links && links.length > 0 && (
        <LinkButtons links={links} containerClassName="mt-10" direction="row" />
      )}
    </div>
  );
}
