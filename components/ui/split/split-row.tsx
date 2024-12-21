import SectionContainer, {
  ISectionContainer,
  ISectionPadding,
} from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import SplitColumn, { ISplitColumn } from "@/components/ui/split/split-column";

export default function SplitRow({
  padding,
  colorVariant,
  splitColumns,
}: Partial<{
  padding: ISectionPadding;
  colorVariant: ISectionContainer["color"];
  splitColumns: ISplitColumn[];
}>) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      {splitColumns && splitColumns?.length > 0 && (
        <div className="grid grid-col-1 gap-6 xl:gap-16">
          {splitColumns?.map((column, index) => (
            <SplitColumn
              key={index}
              colorVariant={colorVariant}
              position={column.position}
              tagLine={column.tagLine}
              title={column.title}
              body={column.body}
              image={column.image}
              link={column.link}
            />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
