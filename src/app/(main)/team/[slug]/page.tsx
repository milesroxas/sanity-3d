import Blocks from '@/components/blocks';
import PortableTextRenderer from '@/components/portable-text-renderer';
import PostHero from '@/components/ui/post/hero';
import { generatePageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import { fetchSanityTeamMemberBySlug, fetchSanityTeamStaticParams } from '../actions';
import TeamMemberPageClient from './page.client';

export const dynamic = 'force-static';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const team = await fetchSanityTeamMemberBySlug({ slug: params.slug });

  if (!team) {
    notFound();
  }

  return generatePageMetadata({ page: team, slug: `/team/${params.slug}` });
}

export async function generateStaticParams() {
  const teams = await fetchSanityTeamStaticParams();

  return teams.map(team => ({
    slug: team.slug,
  }));
}

export default async function TeamMemberPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await fetchSanityTeamMemberBySlug(params);

  if (!post) {
    notFound();
  }

  return (
    <>
      <TeamMemberPageClient />
      <section>
        <div className="container py-16 xl:py-20">
          <article className="mx-auto max-w-3xl">
            <Blocks blocks={post?.blocks} />
            <PostHero {...post} />
            {post.bio && <PortableTextRenderer value={post.bio} />}
          </article>
        </div>
      </section>
    </>
  );
}
