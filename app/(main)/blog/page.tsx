import Blocks from "@/components/blocks";
import SectionContainer from "@/components/ui/section-container";
import Link from "next/link";
import Card from "@/components/ui/card";
import { fetchSanityPosts } from "./actions";
import { fetchSanityPageBySlug } from "../actions";
import { generatePageMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "blog" });

  if (!page)
    throw new Error(
      "Missing 'post' document with slug 'blog' in Sanity Studio"
    );

  return generatePageMetadata({ page, slug: "blog" });
}

export default async function BlogPage() {
  const page = await fetchSanityPageBySlug({ slug: "blog" });
  const posts = await fetchSanityPosts();

  if (!page)
    throw new Error(
      "Missing 'post' document with slug 'blog' in Sanity Studio"
    );

  return (
    <>
      {/* page */}
      <Blocks blocks={page?.blocks} />
      {/* dynamic posts */}
      {posts?.length > 0 && (
        <SectionContainer
          padding={{
            top: true,
            bottom: true,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug.current}
                className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                href={`/blog/${post.slug.current}`}
              >
                <Card
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                />
              </Link>
            ))}
          </div>
        </SectionContainer>
      )}
    </>
  );
}
