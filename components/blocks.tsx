import Hero1 from "@/components/ui/hero/hero-1";
import SectionHeader from "@/components/ui/section-header";

const componentMap: { [key: string]: React.ComponentType<any> } = {
  "hero-1": Hero1,
  "section-header": SectionHeader,
};

export default function Blocks({ blocks }: { blocks?: Sanity.Block[] }) {
  return (
    <>
      {blocks?.map((block: Sanity.Block) => {
        const Component = componentMap[block._type];
        if (!Component) {
          // Fallback for unknown block types to debug
          return <div data-type={block._type} key={block._key} />;
        }
        return <Component {...block} key={block._key} />;
      })}
    </>
  );
}
