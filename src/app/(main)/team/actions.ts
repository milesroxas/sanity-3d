'use server';
import { sanityFetch } from '@/sanity/lib/live';
import { TEAM_LIST_QUERY, TEAM_MEMBER_QUERY, TEAM_SLUGS_QUERY } from '@/sanity/queries/team';

// Fetch all team members for the archive page
export const fetchSanityTeamList = async (): Promise<Sanity.Team[]> => {
  const { data } = await sanityFetch({
    query: TEAM_LIST_QUERY,
  });

  return data;
};

// Fetch all team slugs for static path generation
export const fetchSanityTeamStaticParams = async (): Promise<{ slug: string }[]> => {
  const { data } = await sanityFetch({
    query: TEAM_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  });

  return data;
};

// Fetch a single team member by slug
export const fetchSanityTeamMemberBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<Sanity.Team> => {
  const { data } = await sanityFetch({
    query: TEAM_MEMBER_QUERY,
    params: { slug },
  });

  return data;
};
