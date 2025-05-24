import { Wrapper } from '@/app/(components)/wrapper';
import Blocks from '@/components/blocks';
import MissingSanityPage from '@/components/ui/missing-sanity-page';
import PostCard from '@/components/ui/post-card';
import SectionContainer from '@/components/ui/section-container';
import { generatePageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { fetchSanityPageBySlug } from '../actions';
import { fetchSanityTeamList } from './actions';
export const dynamic = 'force-static';

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: 'team' });

  return generatePageMetadata({ page, slug: 'team' });
}

export default async function TeamPage() {
  const page = await fetchSanityPageBySlug({ slug: 'team' });
  const posts = await fetchSanityTeamList();

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'team' });
  }

  return (
    <>
      <Wrapper lenis>
        <Blocks blocks={page.blocks} />
        {/* dynamic posts */}
        {posts?.length > 0 && (
          <SectionContainer
            padding={{
              padding: 'large',
              direction: 'bottom',
            }}
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {posts.map(post => (
                <Link
                  key={post.slug.current}
                  className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`/team/${post.slug.current}`}
                >
                  <PostCard title={post.title} excerpt={post.role} image={post.image} />
                </Link>
              ))}
            </div>
          </SectionContainer>
        )}
      </Wrapper>
    </>
  );
}
