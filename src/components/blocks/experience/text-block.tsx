import PortableTextRenderer from '@/components/portable-text-renderer';
import { PortableTextBlock } from 'next-sanity';

interface TextBlockProps {
  _type: 'text-block';
  _key: string;
  content?: PortableTextBlock[];
}

export default function TextBlock({ content }: TextBlockProps) {
  return (
    <div className="pb-4 text-base">
      {content && Array.isArray(content) && content.length > 0 && (
        <PortableTextRenderer value={content} />
      )}
    </div>
  );
}
