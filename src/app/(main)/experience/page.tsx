import MainSceneClient from '@/experience/scenes/mainScene/MainSceneClient';
import { generatePageMetadata } from '@/lib/metadata';
import { fetchSanitySceneBySlug } from '../actions';

export const dynamic = 'force-dynamic';

export const revalidate = 0; // Always serve fresh data

export async function generateMetadata() {
  const scene = await fetchSanitySceneBySlug({ slug: 'experience' });
  return generatePageMetadata({ page: scene, slug: 'experience' });
}

export default async function ExperiencePage() {
  const scene = await fetchSanitySceneBySlug({ slug: 'experience' });
  return (
    <>
      <MainSceneClient scene={scene} />
    </>
  );
}
