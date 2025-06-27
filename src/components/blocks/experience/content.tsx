'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { useExpandedContentStore } from '@/experience/scenes/store/expandedContentStore';
import { CircleMinus, CirclePlus } from 'lucide-react';
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
  const { title, setExpandedContent, closeExpandedContent } = useExpandedContentStore();

  const isActive = title === heading;

  const handleClick = () => {
    if (isActive) {
      closeExpandedContent();
    } else if (expandedBody?.length > 0) {
      setExpandedContent(heading, expandedBody);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center space-y-2 rounded-md border px-4 py-4 text-left align-middle transition-all duration-300 ease-out ${
        isActive
          ? 'border-primary bg-green-100 text-slate-900'
          : 'border-gray-200 bg-white/80 hover:border-primary hover:bg-green-50 hover:text-slate-800'
      } `}
    >
      <div className="flex flex-col gap-1 text-sm">
        {heading && (
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-xl font-medium">{heading}</h3>
            {isActive ? <CircleMinus className="h-4 w-4" /> : <CirclePlus className="h-4 w-4" />}
          </div>
        )}
        {sectionBody && <PortableTextRenderer value={sectionBody} />}
        {links && <LinkButtons links={links} />}
      </div>
    </button>
  );
}
