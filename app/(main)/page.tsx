import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "./actions";
import { generatePageMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "index" });

  if (!page)
    throw new Error(
      "Missing 'page' document with slug 'index' in Sanity Studio"
    );

  return generatePageMetadata({ page, slug: "index" });
}

export default async function IndexPage() {
  const page = await fetchSanityPageBySlug({ slug: "index" });

  if (!page)
    throw new Error(
      "Missing 'page' document with slug 'index' in Sanity Studio"
    );

  return <Blocks blocks={page?.blocks} />;
}
