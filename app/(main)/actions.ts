"use server";
import { PAGE_QUERY } from "@/sanity/queries/page";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/queries/singleton/settings";

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

export const fetchSanitySettings = async (): Promise<Sanity.Settings> => {
  const { data } = await sanityFetch({
    query: settingsQuery,
  });
  return data;
};
