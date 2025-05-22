import SplitInfoItem from '@/components/blocks/split/split-info-item';
import { PortableTextBlock } from 'next-sanity';

export interface SplitInfoListProps {
  list: {
    image: Sanity.Image;
    title: string;
    body: PortableTextBlock[];
    tags: string[];
  }[];
}

export default function SplitInfoList({ list }: Partial<SplitInfoListProps>) {
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1">
        {list &&
          list.length > 0 &&
          list.map((item, index) => <SplitInfoItem key={index} {...item} />)}
      </div>
    </div>
  );
}
