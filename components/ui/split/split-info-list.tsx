import SplitInfoItem from "@/components/ui/split/split-info-item";

interface SplitInfoListProps {
  list: {
    image: Sanity.Image;
    title: any;
    body: any;
    tags: string[];
  }[];
}

export default function SplitInfoList({ list }: Partial<SplitInfoListProps>) {
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
        {list &&
          list.length > 0 &&
          list.map((item, index) => <SplitInfoItem key={index} {...item} />)}
      </div>
    </div>
  );
}
