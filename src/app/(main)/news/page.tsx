import { Wrapper } from '@/app/(components)/wrapper';
import Blocks from '@/components/blocks';
import MissingSanityPage from '@/components/ui/missing-sanity-page';
import PostCard from '@/components/ui/post-card';
import SectionContainer from '@/components/ui/section-container';
import { generatePageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { fetchSanityPageBySlug } from '../actions';
import { fetchSanityPosts } from './actions';

export const dynamic = 'force-static';

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: 'news' });

  return generatePageMetadata({ page, slug: 'news' });
}

export default async function BlogPage() {
  const page = await fetchSanityPageBySlug({ slug: 'news' });
  const posts = await fetchSanityPosts();

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'news' });
  }

  return (
    <>
      {/* page */}
      <Wrapper lenis={{}}>
        <Blocks blocks={page?.blocks} />
        {/* dynamic posts */}
        {posts?.length > 0 && (
          <SectionContainer padding={{ padding: 'large', direction: 'both' }}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {posts.map(post => (
                <Link
                  key={post.slug.current}
                  className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`/news/${post.slug.current}`}
                >
                  <PostCard title={post.title} excerpt={post.excerpt} image={post.image} />
                </Link>
              ))}
            </div>
          </SectionContainer>
        )}
      </Wrapper>
    </>
  );
}
