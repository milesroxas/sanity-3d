import { Wrapper } from '@/app/(components)/wrapper';
import PortableTextRenderer from '@/components/portable-text-renderer';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import PostHero from '@/components/ui/post/hero';
import { generatePageMetadata } from '@/lib/metadata';
import { BreadcrumbLink } from '@/types';
import { notFound } from 'next/navigation';
import { fetchSanityPostBySlug, fetchSanityPostsStaticParams } from '../actions';

export const dynamic = 'force-static';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await fetchSanityPostBySlug({ slug: params.slug });

  if (!post) {
    notFound();
  }

  return generatePageMetadata({ page: post, slug: `/blog/${params.slug}` });
}

export async function generateStaticParams() {
  const posts = await fetchSanityPostsStaticParams();

  return posts.map(post => ({
    slug: post.slug.current,
  }));
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await fetchSanityPostBySlug(params);

  if (!post) {
    notFound();
  }

  const links: BreadcrumbLink[] = post
    ? [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'News',
          href: '/news',
        },
        {
          label: post.title as string,
          href: `#`,
        },
      ]
    : [];

  return (
    <Wrapper lenis={{}}>
      <section>
        <div className="container py-16 xl:py-20">
          <article className="mx-auto max-w-3xl">
            <Breadcrumbs links={links} />
            <PostHero {...post} />
            {post.body && <PortableTextRenderer value={post.body} />}
          </article>
        </div>
      </section>
    </Wrapper>
  );
}
