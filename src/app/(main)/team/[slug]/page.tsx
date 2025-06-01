import Blocks from '@/components/blocks';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { generatePageMetadata } from '@/lib/metadata';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
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
  const team = await fetchSanityTeamMemberBySlug({ slug: params.slug });
  if (!team) {
    notFound();
  }

  return (
    <>
      <TeamMemberPageClient />
      <section>
        <div className="container">
          <article>
            <div className="grid min-h-screen grid-cols-1 gap-4 md:grid-cols-12">
              <div className="col-span-6">
                {team.image && team.image.asset?._id && (
                  <div className="flex h-full w-full items-end align-middle md:pt-0 md:align-bottom lg:pt-64">
                    <Image
                      src={urlFor(team.image).auto('format').fit('max').quality(100).url()}
                      alt={team.image.alt || ''}
                      placeholder="blur"
                      blurDataURL={team.image.asset?.metadata?.lqip || undefined}
                      width={team.image.asset?.metadata?.dimensions?.width || 1200}
                      height={team.image?.asset?.metadata?.dimensions?.height || 630}
                      quality={100}
                      className="object-cover lg:h-full lg:w-full"
                    />
                  </div>
                )}
              </div>
              <div className="col-span-6 flex flex-col justify-center">
                {team.title && (
                  <h1 className="mb-2 text-4xl font-light text-primary">{team.title}</h1>
                )}
                {team.role && <p className="mb-6 text-lg">{team.role}</p>}
                {team.bio && <PortableTextRenderer value={team.bio} />}
              </div>
            </div>
            <Blocks blocks={team?.blocks} />
          </article>
        </div>
      </section>
    </>
  );
}
