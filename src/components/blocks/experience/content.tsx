'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { useExpandedContentStore } from '@/experience/scenes/store/expandedContentStore';
import { ChevronRight } from 'lucide-react';
import { PortableTextBlock } from 'next-sanity';

export interface ContentProps {
  heading: string;
  sectionBody: PortableTextBlock[];
  expandedBody: PortableTextBlock[];
  links: Sanity.Link[];
}

export default function ExpandedContent({
  heading,
  sectionBody,
  expandedBody,
  links,
}: ContentProps) {
  const { setExpandedContent } = useExpandedContentStore();

  const handleHeadingClick = () => {
    if (expandedBody && expandedBody.length > 0) {
      setExpandedContent(heading, expandedBody);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {heading && (
        <button
          onClick={handleHeadingClick}
          className="flex items-center gap-1 text-left text-2xl font-bold transition-colors hover:text-secondary"
        >
          {heading}
          {expandedBody && expandedBody.length > 0 && <ChevronRight className="h-5 w-5" />}
        </button>
      )}
      {sectionBody && <PortableTextRenderer value={sectionBody} />}
      {links && <LinkButtons links={links} />}
    </div>
  );
}
