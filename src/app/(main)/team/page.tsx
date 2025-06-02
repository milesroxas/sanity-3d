import Blocks from '@/components/blocks';
import MissingSanityPage from '@/components/ui/missing-sanity-page';
import { generatePageMetadata } from '@/lib/metadata';
import { fetchSanityPageBySlug } from '../actions';
import { fetchSanityTeamList, fetchSanityTeamMemberBySlug } from './actions';

import TeamPageClient from './page.client';
export const dynamic = 'force-static';

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: 'team' });

  return generatePageMetadata({ page, slug: 'team' });
}

export default async function TeamPage() {
  const page = await fetchSanityPageBySlug({ slug: 'team' });
  const posts = await fetchSanityTeamList();
  const member = await fetchSanityTeamMemberBySlug({ slug: 'team' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'team' });
  }

  return (
    <>
      <TeamPageClient
        member={
          member
            ? {
                title: member.title,
                role: member.role,
                image: member.image,
                bio: member.bio,
                email: member.email,
                slug: member.slug,
              }
            : null
        }
        teamMembers={posts.map(post => ({
          title: post.title,
          role: post.role,
          image: post.image,
          bio: post.bio,
          email: post.email,
          slug: post.slug,
        }))}
      />
      <Blocks blocks={page.blocks} />
    </>
  );
}
