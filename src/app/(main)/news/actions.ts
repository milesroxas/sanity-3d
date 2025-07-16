"use server";
import { POST_QUERY } from "@/sanity/queries/post";
import { POSTS_QUERY, POSTS_SLUGS_QUERY } from "@/sanity/queries/posts";
import { sanityFetch } from "@/sanity/lib/live";

export const fetchSanityPosts = async (): Promise<Sanity.Post[]> => {
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
  });

  return data;
};

export const fetchSanityPostsStaticParams = async (): Promise<
  Sanity.Post[]
> => {
  const { data } = await sanityFetch({
    query: POSTS_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityPostBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<Sanity.Post> => {
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
  });

  return data;
};
