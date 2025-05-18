import MainSceneClient from '@/experience/scenes/mainScene/MainSceneClient';
import { generatePageMetadata } from '@/lib/metadata';
import { fetchSanitySceneBySlug } from '../actions';

export const dynamic = 'force-static';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata() {
  const scene = await fetchSanitySceneBySlug({ slug: 'experience' });
  return generatePageMetadata({ page: scene, slug: 'experience' });
}

export default async function ExperiencePage() {
  const scene = await fetchSanitySceneBySlug({ slug: 'experience' });
  return <MainSceneClient scene={scene} />;
}
