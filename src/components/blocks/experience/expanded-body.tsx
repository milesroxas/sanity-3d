import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { PortableTextBlock } from 'next-sanity';

interface ExpandedBodyProps {
  body: PortableTextBlock[];
  links: Sanity.Link[];
}

export default function ExpandedBody({ body, links }: ExpandedBodyProps) {
  return (
    <div className="pb-12 text-base">
      {body && <PortableTextRenderer value={body} />}

      {links && (
        <div className="mt-4 flex w-full max-w-md gap-3">
          {links.slice(0, 2).map((link, index) => (
            <LinkButtons
              key={index}
              links={[link]}
              size="sm"
              direction="column"
              variant={index === 0 ? 'secondary' : 'ghost'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
