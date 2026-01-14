import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { PortableTextBlock } from 'next-sanity';

interface TextBlockProps {
  _type: 'text-block';
  _key: string;
  content?: PortableTextBlock[];
  links?: Sanity.Link[];
  renderContext?: string;
}

export default function TextBlock({ content, links, renderContext }: TextBlockProps) {
  const isOverlay = renderContext === 'overlay';

  return (
    <div className={isOverlay ? 'max-w-2xl' : 'pb-4 text-base'}>
      {content && Array.isArray(content) && content.length > 0 && (
        <PortableTextRenderer value={content} variant={isOverlay ? 'sheet' : 'default'} />
      )}
      {links && links.length > 0 && (
        <LinkButtons links={links} containerClassName={isOverlay ? 'mt-8' : 'mt-4'} />
      )}{' '}
    </div>
  );
}
