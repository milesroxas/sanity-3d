'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { PortableTextBlock } from 'next-sanity';

export interface ContentProps {
  body: PortableTextBlock[];
  links: Sanity.Link[];
}

export default function Content({ body, links }: ContentProps) {
  return (
    <div className="flex flex-col gap-4">
      {body && <PortableTextRenderer value={body} />}
      {links && <LinkButtons links={links} />}
      <LinkButtons links={links} />
    </div>
  );
}
