import Blocks from '@/components/blocks';
import { LinkButtons } from '@/components/shared/link-button';

interface ExpandedBodyProps {
  blocks?: Sanity.Block[];
  links?: Sanity.Link[];
}

export default function ExpandedBody({ blocks, links }: ExpandedBodyProps) {
  return (
    <div className="pb-12 text-base">
      {blocks && Array.isArray(blocks) && blocks.length > 0 && (
        <div className="flex flex-col gap-4">
          <Blocks blocks={blocks} />
        </div>
      )}

      {links && Array.isArray(links) && links.length > 0 && (
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
