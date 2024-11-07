import Blocks from "@/components/blocks";
import SectionContainer from "@/components/ui/section-container";
import Link from "next/link";
import Card from "@/components/ui/card";
import { fetchSanityPosts } from "./actions";
import { fetchSanityPageBySlug } from "../actions";
import { urlFor } from "@/sanity/lib/image";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export const dynamic = "force-static";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "blog" });

  if (!page)
    throw new Error(
      "Missing 'post' document with slug 'blog' in Sanity Studio"
    );

  return {
    title: page?.meta_title || page?.title,
    description: page?.meta_description,
    openGraph: {
      images: [
        {
          url: page?.ogImage
            ? urlFor(page?.ogImage).auto("format").fit("max").quality(100).url()
            : `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
          width: page?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
          height: page?.ogImage?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : page?.noindex
        ? "noindex"
        : "index, follow",
    alternates: {
      canonical: "/blog",
    },
  };
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
