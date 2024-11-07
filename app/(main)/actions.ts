"use server";
import { PAGE_QUERY } from "@/sanity/queries/page";
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
