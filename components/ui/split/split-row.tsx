import { cn } from "@/lib/utils";
import SectionContainer, {
  ISectionPadding,
  ISectionContainer,
} from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import SplitContent from "./split-content";
import SplitCardsList from "./split-cards-list";
import SplitImage from "./split-image";
import SplitInfoList from "./split-info-list";
import SplitVideo from "./split-video";
const componentMap = {
  "split-content": SplitContent,
  "split-cards-list": SplitCardsList,
  "split-image": SplitImage,
  "split-info-list": SplitInfoList,
  "split-video": SplitVideo,
} as const;

export default function SplitRow({
  padding,
  colorVariant,
  noGap,
  splitColumns,
}: Partial<{
  padding: ISectionPadding;
  colorVariant: ISectionContainer["color"];
  noGap: boolean;
  splitColumns: Array<{
    _type:
      | "split-content"
      | "split-cards-list"
      | "split-image"
      | "split-info-list"
      | "split-video";
    _key: string;
  }>;
}>) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      {splitColumns && splitColumns?.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2",
            noGap ? "gap-0" : "gap-12 lg:gap-20"
          )}
        >
          {splitColumns?.map((block) => {
            const Component =
              componentMap[block._type as keyof typeof componentMap];
            if (!Component) {
              return <div data-type={block._type} key={block._key} />;
            }
            return (
              <Component
                {...block}
                color={color}
                noGap={noGap}
                key={block._key}
              />
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
