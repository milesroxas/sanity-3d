'use server';
import { client } from '@/sanity/lib/client';
import { sanityFetch } from '@/sanity/lib/live';
import { PAGE_QUERY } from '@/sanity/queries/page';
import { NAVIGATION_SCENES_QUERY, SCENE_QUERY } from '@/sanity/queries/scene';
import { SCENES_QUERY, SCENES_SLUGS_QUERY } from '@/sanity/queries/scenes';
import { SERVICES_QUERY } from '@/sanity/queries/services';
import { NAV_QUERY } from '@/sanity/queries/singleton/nav';
import { SETTINGS_QUERY } from '@/sanity/queries/singleton/settings';
import { TEAM_MEMBER_QUERY } from '@/sanity/queries/team';

export const fetchSanityPageBySlug = async ({ slug }: { slug: string }): Promise<Sanity.Page> => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
  });

  return data;
};

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

export const fetchSanitySettings = async (): Promise<Sanity.Settings> => {
  const { data } = await sanityFetch({
    query: SETTINGS_QUERY,
  });
  return data;
};

export const fetchSanityServicesBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<Sanity.Services> => {
  const { data } = await sanityFetch({
    query: SERVICES_QUERY,
    params: { slug },
  });
  return data;
};
export const fetchSanityScenes = async (): Promise<Sanity.Scene[]> => {
  const { data } = await sanityFetch({
    query: SCENES_QUERY,
  });

  return data;
};

export const fetchSanityScenesStaticParams = async (): Promise<Sanity.Scene[]> => {
  const { data } = await sanityFetch({
    query: SCENES_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  });

  return data;
};
export const fetchSanitySceneBySlug = async ({ slug }: { slug: string }): Promise<Sanity.Scene> => {
  const { data } = await sanityFetch({
    query: SCENE_QUERY,
    params: { slug },
  });

  return data;
};

export async function fetchNavigationScenes() {
  const data = await client.fetch(NAVIGATION_SCENES_QUERY);
  return data?.pointsOfInterest ?? [];
}

export const fetchSanityNav = async (): Promise<Sanity.Nav> => {
  const { data } = await sanityFetch({
    query: NAV_QUERY,
  });
  return data;
};

export const fetchAllSanityServices = async (): Promise<Sanity.Services[]> => {
  const { data } = await sanityFetch({
    query: `*[_type == "services"] | order(title asc){
      _id,
      _type,
      title,
      slug,
      meta_title,
      meta_description,
      noindex,
      ogImage {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    }`,
  });
  return data;
};
