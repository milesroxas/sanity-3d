"use server";
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from "@/sanity/queries/page";
import { sanityFetch } from "@/sanity/lib/live";

export const fetchSanityPageBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<Sanity.Page> => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
  });

  return data;
};

export const fetchSanityPagesStaticParams = async (): Promise<
  Sanity.Page[]
> => {
  const { data } = await sanityFetch({
    query: PAGES_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return data;
};
