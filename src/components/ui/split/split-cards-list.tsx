import { ISectionContainerProps } from '@/components/ui/section-container';
import SplitCardsItem from '@/components/ui/split/split-cards-item';
import { PortableTextBlock, stegaClean } from 'next-sanity';

export interface SplitCardsListProps {
  color: ISectionContainerProps['color'];
  list: {
    tagLine: string;
    title: string;
    body: PortableTextBlock[];
  }[];
}

export default function SplitCardsList({ color, list }: Partial<SplitCardsListProps>) {
  const colorParent = stegaClean(color);

  return (
    <div className="flex flex-col justify-center gap-12">
      {list &&
        list.length > 0 &&
        list.map((item, index) => (
          <SplitCardsItem
            key={index}
            color={colorParent}
            tagLine={item.tagLine}
            title={item.title}
            body={item.body}
          />
        ))}
    </div>
  );
}
